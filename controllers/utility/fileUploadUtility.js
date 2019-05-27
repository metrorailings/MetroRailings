/**
 * @module fileUploadUtility
 */

// ----------------- EXTERNAL MODULES --------------------------

const _Handlebars = require('handlebars'),

	fileManager = global.OwlStakes.require('utility/fileManager');

// ----------------- ENUMS/CONSTANTS --------------------------

const FILE_UPLOAD_FOLDER = 'fileUpload',

	PARTIALS =
	{
		FILE_UPLOAD: 'fileUpload',
		THUMBNAIL: 'thumbnail',
		UPLOAD_SECTION: 'uploadSection',
		TEMPLATES: 'uploadTemplates'
	};

// ----------------- PARTIALS --------------------------

/**
 * The template for the file upload module
 */
_Handlebars.registerPartial('fileUpload', fileManager.fetchTemplateSync(FILE_UPLOAD_FOLDER, PARTIALS.FILE_UPLOAD));

/**
 * The template for the thumbnails that represent uploaded files
 */
_Handlebars.registerPartial('thumbnail', fileManager.fetchTemplateSync(FILE_UPLOAD_FOLDER, PARTIALS.THUMBNAIL));

/**
 * The template for the upload form
 */
_Handlebars.registerPartial('uploadSection', fileManager.fetchTemplateSync(FILE_UPLOAD_FOLDER, PARTIALS.UPLOAD_SECTION));

/**
 * The template containing all the templates needed to dynamically load this module on the fly
 */
_Handlebars.registerPartial('uploadTemplates', fileManager.fetchTemplateSync(FILE_UPLOAD_FOLDER, PARTIALS.TEMPLATES));

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Function designed to programmatically fetch the templates for any notes-related modules so that we can render
	 * notes on a dynamic basis
	 *
	 * @author kinsho
	 */
	basicInit: async function ()
	{
		let fileUploadTemplate = await fileManager.fetchTemplate(FILE_UPLOAD_FOLDER, PARTIALS.FILE_UPLOAD),
			thumbnailTemplate = await fileManager.fetchTemplate(FILE_UPLOAD_FOLDER, PARTIALS.THUMBNAIL),
			formTemplate = await fileManager.fetchTemplate(FILE_UPLOAD_FOLDER, PARTIALS.UPLOAD_SECTION),
			pageData = {};

		pageData =
		{
			fileUploadTemplate: fileUploadTemplate,
			thumbnailTemplate: thumbnailTemplate,
			uploadFormTemplate: formTemplate,
		};

		return {
			pageData: pageData
		};
	}
};