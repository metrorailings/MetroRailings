// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/orderDetails/viewModel';
import orderSummary from 'client/scripts/orderDetails/orderSummary';
import customerSummary from 'client/scripts/orderDetails/customerSummary';
import locationSummary from 'client/scripts/orderDetails/locationSummary';
import orderSpecifics from 'client/scripts/orderDetails/orderSpecifics';
import submissionSection from 'client/scripts/orderDetails/submissionSection';

// ----------------- ENUMS/CONSTANTS ---------------------------

// ----------------- PRIVATE VARIABLES ---------------------------

// ----------------- PRIVATE FUNCTIONS ---------------------------

// ----------------- LISTENERS ---------------------------

// ----------------- LISTENER INITIALIZATION -----------------------------

// ----------------- DATA INITIALIZATION -----------------------------

// Load a copy of the original order into the view model
vm.originalOrder = window.MetroRailings.order;

// ----------------- PAGE INITIALIZATION -----------------------------