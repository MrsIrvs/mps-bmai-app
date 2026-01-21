import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InviteUserRequest {
  email: string
  fullName: string
  role: 'admin' | 'technician' | 'client'
  region?: string
  buildings?: string[]
  tempPassword: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Validate authorization
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create client with user's auth context to check their role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    // Verify the caller's JWT and get their user ID
    const token = authHeader.replace('Bearer ', '')
    const { data: claimsData, error: claimsError } = await userClient.auth.getUser(token)
    
    if (claimsError || !claimsData?.user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const callerId = claimsData.user.id

    // Check if caller is an admin using service role client
    const adminClient = createClient(supabaseUrl, supabaseServiceKey)
    
    const { data: callerRole, error: roleError } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', callerId)
      .single()

    if (roleError || callerRole?.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Only admins can invite users' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const body: InviteUserRequest = await req.json()
    const { email, fullName, role, region, buildings, tempPassword } = body

    // Validate required fields
    if (!email || !fullName || !role || !tempPassword) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, fullName, role, tempPassword' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate role
    if (!['admin', 'technician', 'client'].includes(role)) {
      return new Response(
        JSON.stringify({ error: 'Invalid role. Must be admin, technician, or client' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create the user using admin API
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true, // Auto-confirm the email
      user_metadata: {
        full_name: fullName
      }
    })

    if (createError) {
      return new Response(
        JSON.stringify({ error: createError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const newUserId = newUser.user.id

    // The trigger will create profile with 'client' role by default
    // Now update to the correct role if not client
    if (role !== 'client') {
      const { error: roleUpdateError } = await adminClient
        .from('user_roles')
        .update({ role })
        .eq('user_id', newUserId)

      if (roleUpdateError) {
        console.error('Failed to update role:', roleUpdateError)
      }
    }

    // Update profile with region/buildings if provided
    const profileUpdate: Record<string, unknown> = {}
    if (role === 'technician' && region) {
      profileUpdate.region = region
    }
    if (role === 'client' && buildings && buildings.length > 0) {
      profileUpdate.buildings = buildings
    }

    if (Object.keys(profileUpdate).length > 0) {
      const { error: profileError } = await adminClient
        .from('profiles')
        .update(profileUpdate)
        .eq('user_id', newUserId)

      if (profileError) {
        console.error('Failed to update profile:', profileError)
      }
    }

    // Update buildings.client_user_ids for client users
    if (role === 'client' && buildings && buildings.length > 0) {
      for (const buildingId of buildings) {
        const { data: building } = await adminClient
          .from('buildings')
          .select('client_user_ids')
          .eq('id', buildingId)
          .maybeSingle()

        if (building) {
          const currentIds = building.client_user_ids || []
          if (!currentIds.includes(newUserId)) {
            await adminClient
              .from('buildings')
              .update({ client_user_ids: [...currentIds, newUserId] })
              .eq('id', buildingId)
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: {
          id: newUserId,
          email,
          fullName,
          role
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in invite-user function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
