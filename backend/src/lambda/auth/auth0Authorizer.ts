import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'
import { JwksClient } from'jwks-rsa'

const logger = createLogger('auth')
const jwksURL = process.env.AUTH_0_JWKS;

export const handler = async ( event: CustomAuthorizerEvent ): Promise<CustomAuthorizerResult> => {
  logger.info(`Authorizing a user with this ${event.authorizationToken} token`)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt
  // Configuring JWKS client as per : https://www.npmjs.com/package/jwks-rsa documentations
  const client = new JwksClient({
    jwksUri: jwksURL,
  });
  const kid = jwt.header.kid;
  const key = await client.getSigningKey(kid);
  const signingKey = key.getPublicKey();
  // Using verify as per : https://www.npmjs.com/package/jsonwebtoken documentations
  return verify(token, signingKey, { algorithms: ['RS256'] }) as JwtPayload;
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
