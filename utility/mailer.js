// ----------------- EXTERNAL MODULES --------------------------

var _nodemailer = require('nodemailer'),
	_Q = require('q'),
	_styliner = require('styliner'),
	_sass = require('node-sass'),

	config = global.OwlStakes.require('config/config'),
	fileManager = global.OwlStakes.require('utility/fileManager'),
	templateManager = global.OwlStakes.require('utility/templateManager');

// ----------------- ENUMS/CONSTANTS --------------------------

var EMAIL_DIRECTORY = 'email',
	BASE_EMAIL_TEMPLATE = 'baseEmail',

	EMAIL_STYLESHEET_DIRECTORY = '/client/styles/email/',

	SCSS_EXTENSION = '.scss',
	SCSS_INCLUDE_PATHS =
	[
		'client/styles/foundation/'
	],
	COMPRESSED_KEYWORD;

// ----------------- PRIVATE VARIABLES --------------------------

var _transport = _nodemailer.createTransport(config.NODEMAILER_CONFIG), // The actual object to invoke in order to send mail
	_inlineStyler = new _styliner('');

// ----------------- GENERATOR TRANSFORMATION FUNCTIONS --------------------------

var _sendMail = _Q.nbind(_transport.sendMail, _transport);

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function responsible for generating the whole e-mail in HTML format
	 *
	 * @param {String} templateName - the name of the template which to use to render the content of the e-mail
	 * @param {Object} templateData - the data that will be used to populate the template
	 * @param {String} stylesheetName - the name of the sass file to use in order to style the e-mail
	 *
	 * @returns {Promise<String>} - a blob of text that represents the entire e-mail
	 *
	 * @author kinsho
	 */
	generateFullEmail: _Q.async(function* (templateName, templateData, stylesheetName)
	{
		var deferred = _Q.defer(),
			stylesheet = yield fileManager.fetchFile(EMAIL_STYLESHEET_DIRECTORY + stylesheetName + SCSS_EXTENSION),
			styles,
			emailDetails,
			completeEmail;

		// Given that we fetched the stylesheet, we must parse that stylesheet into CSS
		styles = _sass.renderSync(
		{
			data: stylesheet,
			includePaths: SCSS_INCLUDE_PATHS,
			outputStyle: COMPRESSED_KEYWORD
		}).css;

		// Render the content of the e-mail using the data and the reference to the content template
		emailDetails = yield templateManager.populateTemplate(templateData, EMAIL_DIRECTORY, templateName);

		// Now use the rendered content and system defaults to generate the HTML e-mail
		completeEmail = yield templateManager.populateTemplate(
			{
				email: emailDetails,
				style: styles,
				currentYear: new Date().getFullYear(),
				supportNumber: config.SUPPORT_PHONE_NUMBER,
				supportForm: config.BASE_URL + config.SUPPORT_EMAIL_FORM_URL
			}, EMAIL_DIRECTORY, BASE_EMAIL_TEMPLATE);

		// To ensure that Gmail renders our e-mail as intended, we have to inline all styling using Styliner
		// Promise logic has to be used here as this function is not generator-friendly
		_inlineStyler.processHTML(completeEmail).then(function(processedEmail)
		{
			deferred.resolve(processedEmail);
		}, function(err)
		{
			console.log(err);
			deferred.reject();
		});

		return deferred.promise;
	}),

	/**
	 * Function meant to send an e-mail to a customer
	 *
	 * @param {String} htmlText - the HTML that comprises the e-mail
	 * @param {String} plainText - the unicode text that will show instead should the user's mail client not support HTML e-mails
	 * @param {String} email - the e-mail address to which to send this e-mail
	 * @param {String} subject - the subject to append to the e-mail
	 * @param {String} [fromEntity] - the address that will be used to identify the sender
	 *
	 * @return {boolean} - a flag indicating whether the e-mail was sent successfully or rejected
	 *
	 * @author kinsho
	 */
	sendMail: _Q.async(function* (htmlText, plainText, email, subject, fromEntity)
	{
		console.log("Sending e-mail to " + email);

		var mail;

		try
		{
			mail = yield _sendMail(
				{
					from: fromEntity,
					to: email,
					subject: subject,
					text: plainText,
					html: htmlText
				});

			return !!(mail.accepted.length);
		}
		catch(error)
		{
			console.log("Had trouble sending e-mail to " + email + "!");
			console.log(error);
			return false;
		}
	})
};
