// ----------------- EXTERNAL MODULES --------------------------

import vm from 'client/scripts/contactUs/viewModel';
import formSection from 'client/scripts/contactUs/formSection';
import submissionSection from 'client/scripts/contactUs/submissionSection';

// ----------------- ENUMS/CONSTANTS ----------------------

// ----------------- PRIVATE VARIABLES ---------------------------

// ----------------- PRIVATE FUNCTIONS ---------------------------

// ----------------- LISTENERS ---------------------------

// ----------------- LISTENER INITIALIZATION -----------------------------

// ----------------- DATA INITIALIZATION -----------------------------

vm.name = window.MetroRailings.contactUs.name || '';
vm.orderId = window.MetroRailings.contactUs.orderId || '';
vm.email = window.MetroRailings.contactUs.email || '';
vm.areaCode = window.MetroRailings.contactUs.areaCode || '';
vm.phoneOne = window.MetroRailings.contactUs.phoneOne || '';
vm.phoneTwo = window.MetroRailings.contactUs.phoneTwo || '';
vm.comments = '';

// ----------------- PAGE INITIALIZATION -----------------------------