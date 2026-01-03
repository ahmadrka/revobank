// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { OIDCStrategy } from 'passport-azure-ad';

// // strategies/microsoft.strategy.ts
// @Injectable()
// export class MicrosoftStrategy extends PassportStrategy(
//   OIDCStrategy,
//   'microsoft',
// ) {
//   constructor() {
//     super({
//       identityMetadata:
//         'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
//       clientID: process.env.MS_CLIENT_ID,
//       clientSecret: process.env.MS_CLIENT_SECRET,
//       responseType: 'code',
//       responseMode: 'query',
//       redirectUrl: process.env.MS_CALLBACK_URL,
//       scope: ['profile', 'email', 'openid'],
//     });
//   }

//   async validate(profile: any) {
//     return {
//       provider: 'microsoft',
//       providerId: profile.oid,
//       email: profile._json.preferred_username,
//       name: profile.displayName,
//     };
//   }
// }
