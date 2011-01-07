# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_jeffreyatw_uservoice_practical_session',
  :secret      => 'c29b3c1086dc1c97f72e2a3b51e14a9e7d1f7d22680f327b15fb912aa62ef315b1228973ec3eaee5260c3a5af339c50a84e1b454630550df36f962d638bff979'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
