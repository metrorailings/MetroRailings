/**
 * @module questionnaireResponsesController
 */

// ----------------- EXTERNAL MODULES --------------------------

const _Handlebars = require('handlebars'),

	controllerHelper = global.OwlStakes.require('controllers/utility/controllerHelper'),

	deckRemodelersData = global.OwlStakes.require('shared/questionnaire/deckRemodelers'),

	DAO = global.OwlStakes.require('data/DAO/customerFormsDAO'),

	fileManager = global.OwlStakes.require('utility/fileManager'),
	templateManager = global.OwlStakes.require('utility/templateManager'),

	drConfig = global.OwlStakes.require('config/deckRemodelers.config');

// ----------------- ENUM/CONSTANTS --------------------------

const CONTROLLER_FOLDER = 'questionnaireResponses',
	UTILITY_FOLDER = 'utility',

	PARTIALS =
	{
		BANNER: 'banner'
	};

// ----------------- PARTIAL TEMPLATES --------------------------

/**
 * The template for the banner to display at the top of the page
 */
_Handlebars.registerPartial('bannerSection', fileManager.fetchTemplateSync(UTILITY_FOLDER, PARTIALS.BANNER));

// ----------------- PRIVATE FUNCTIONS --------------------------

// ----------------- MODULE DEFINITION --------------------------

module.exports =
{
	/**
	 * Initializer function responsible for serving the page
	 *
	 * @author kinsho
	 */
	init: async function (params)
	{
		console.log('Loading out a customer form from which we\'ll generate a PDF...');

		let formData = await DAO.getFormData(parseInt(params.id, 10)),
			designData = [],
			designKeys = Object.keys(formData.design),
			designDictionary = deckRemodelersData.designOptions,
			templateData = {},
			options;

		// Gather the design data we need to show on the PDF
		for (let i = 0; i < designKeys.length; i += 1)
		{
			for (let j = 0; j < designDictionary.length; j += 1)
			{
				// Find out what design category we need to consult first
				if (designKeys[i] === designDictionary[j].id)
				{
					options = designDictionary[j].options;

					// Now track down the metadata associated with whatever value has been specified for the given
					// design category
					for (let k = 0; k < options.length; k += 1)
					{
						if (options[k].value === formData.design[designKeys[i]])
						{
							designData.push(
							{
								name: designDictionary[j].name,
								value: options[k].name,
								image: options[k].previewImage
							});
						}
					}
				}
				
			}
		}

		// Display the project manager's full name on the screen instead of the codeword
		templateData.projectManager = drConfig.MANAGERS[formData.projectManager];
		templateData.formData = formData;
		templateData.designData = designData;		

		// Render the page template
		let populatedPageTemplate = await templateManager.populateTemplate(templateData, CONTROLLER_FOLDER, CONTROLLER_FOLDER);

		return await controllerHelper.renderInitialView(populatedPageTemplate, CONTROLLER_FOLDER, {}, false, true);
	}
};