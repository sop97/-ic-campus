/**
 * IC-Campus — Proxy de développement Angular
 *
 * Ce fichier configure le serveur de développement ng serve pour proxifier
 * les appels API vers le conteneur ic-api local. Il reproduit le comportement
 * de nginx en production : l'en-tête Authorization est ajouté ici via les
 * variables d'environnement, exactement comme nginx l'injecte via envsubst.
 *
 * Usage :
 *   export API_USER=icadmin
 *   export API_PASSWORD="ic@2024"
 *   ng serve   (ou : source ../.env && ng serve)
 *
 * Ne jamais écrire les credentials en dur dans ce fichier.
 */

const user = process.env.API_USER     || '';
const pass = process.env.API_PASSWORD || '';

if (!user || !pass) {
  console.warn('[proxy] API_USER ou API_PASSWORD non définis — les appels API échoueront avec 401');
}

const b64 = Buffer.from(`${user}:${pass}`).toString('base64');

module.exports = {
  '/icgroup/api': {
    target: `http://localhost:${process.env.API_PORT || '5000'}`,
    secure: false,
    changeOrigin: true,
    logLevel: 'info',
    headers: {
      Authorization: `Basic ${b64}`,
    },
  },
};
