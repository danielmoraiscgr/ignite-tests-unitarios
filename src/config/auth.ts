export default {
  jwt: {
    secret: process.env.JWT_SECRET as string || 'minhasenhasecreta',
    expiresIn: '1d'
  }
}
