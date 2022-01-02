const passport = require('passport');
const strategy = require('passport-facebook');
const Usuario = require("../models/usurio");
const { generarJWT } = require('./generar-jwt');

 
passport.use(
  new strategy(
  {
    clientID : process.env.FACEBOOK_CLIENT_ID,
    clientSecret : process.env.FACEBOOK_CLIENT_SECRET_ID,
    callbackURL : "https://restserver-petouse.herokuapp.com/api/auth/callback",
    profileFields: ['id', 'emails', 'name',"picture"]
  },
    
  async function(accessToken,refreshToken,profile,done)
  {   
    const name =`${profile.name.givenName} ${profile.name.familyName}`;
    const email = profile.emails[0].value;
    const img= profile.photos[0].value;

    
    let user=await Usuario.findOne({email});
     if(!user){
            //si no existe el usuario tengo que crearlo
            const data={
                name,
                email,
                rol:"USER_ROLE",
                password:":p",
                img,
            };

            user = new Usuario(data);
            await user.save();
        }
       //si el usuario en db tiene el estado en false

       if(!user.condition){
        console.log("Usuario con condition en false");
        }
        
        //Generar el jwt
        const token = await generarJWT(user.id);
        console.log(user,"\n",token);
    done(null,profile);
  }
  )
);

      
