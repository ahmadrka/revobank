// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-jwt';

// @Injectable()
// export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
//   constructor() {
//     super({
//       clientID: process.env.APPLE_CLIENT_ID,
//       teamID: process.env.APPLE_TEAM_ID,
//       keyID: process.env.APPLE_KEY_ID,
//       privateKeyString: process.env.APPLE_PRIVATE_KEY,
//       callbackURL: process.env.APPLE_CALLBACK_URL,
//       scope: ['name', 'email'],
//     });
//   }

//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     idToken: any,
//     profile: any,
//   ) {
//     return {
//       provider: 'apple',
//       providerId: idToken.sub,
//       email: idToken.email,
//     };
//   }
// }
