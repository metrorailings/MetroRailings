// ----------------- EXTERNAL MODULES --------------------------

import customerSection from 'client/scripts/orderGeneral/customerSection';
import addressSection from 'client/scripts/orderGeneral/addressSection';
import typeSection from 'client/scripts/orderGeneral/typeSection';
import baseDesignSection from 'client/scripts/orderGeneral/baseDesignSection';
import advancedDesignSection from 'client/scripts/orderGeneral/advancedDesignSection';
import picketSection from 'client/scripts/orderGeneral/picketSection';
import cableSection from 'client/scripts/orderGeneral/cableSection';
import glassSection from 'client/scripts/orderGeneral/glassSection';
import logisticsSection from 'client/scripts/orderGeneral/logisticsSection';
import moneySection from 'client/scripts/orderGeneral/moneySection';
import agreementSection from 'client/scripts/orderGeneral/agreementSection';
import descriptor from 'client/scripts/orderGeneral/designDescriptor';

import submissionSection from 'client/scripts/createQuote/submissionSection';

// ----------------- HANDLEBAR HELPERS ---------------------------

/**
 * Handlebars helper function designed to round any number to a fixed number of decimal digits
 *
 * @author kinsho
 */
Handlebars.registerHelper('to_fixed', function(num, decimalDigits)
{
	return num.toFixed(decimalDigits);
});