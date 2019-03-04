// ----------------- APP_ROOT_PATH INSTANTIATION --------------------------

global.OwlStakes =
{
	require : require('app-root-path').require
};

// ------------- EXTERNAL MODULES --------------------------

const _crypto = require('crypto'),

	config = global.OwlStakes.require('config/config');

// ----------------- ENUMS/CONSTANTS --------------------------

const USERNAME = 'kinsho',
	PASSWORD = 'password',

	KEY = 'miyamotomiyamotomiyamoto',
	IV = _crypto.randomBytes(16);

// ----------------- MODULE DEFINITION --------------------------

let textToHash = USERNAME + '||' + PASSWORD + '||' + new Date().getTime(),
	cipher = _crypto.createCipheriv(config.ENCRYPTION_ALGORITHM, KEY, IV),
	cipherText;

// Encrypt whatever text needs to be encoded
cipherText = cipher.update(textToHash, config.ENCRYPTION_INPUT_TYPE, config.ENCRYPTION_OUTPUT_TYPE);
cipherText += cipher.final(config.ENCRYPTION_OUTPUT_TYPE);

cipherText = IV.toString('hex') + cipherText.toString('hex');

console.log(cipherText);

// Close out this program
console.log('Done!');
process.exit();