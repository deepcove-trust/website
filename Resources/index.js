import _ from 'lodash';
import $ from 'jquery';

$.ajaxSetup({
    statusCode: {
        401: function (xhr, textStatus, errorThrown) {
            // Any 401 request on any route other than /login
            // should result in a redirect to the Login page.
            // The best way to do this is to refresh the page
            // so we preserve the redirect URL.
            if (this.url.includes('/login') || this.url == '/login') return;
            location.reload();
        }
    }
});

/* JavaScript Core */
import './js/popper.min';
import './js/bootstrap.bundle.min.js';
//import './js/Bootstrap/index';

/* React */
import './nReact/UserAccounts';
//OLD
import './js/React/AdminPortal/AccountSettings';
import './js/React/Authentication/Login';
import './js/React/Authentication/RequestPasswordReset';
import './js/React/Authentication/ResetPassword';
import './js/React/Authentication/Register';
import './js/React/AdminPortal/Dashboard';
import './js/React/AdminPortal/Pages';
import './js/React/AdminPortal/PagesNew';
import './js/React/AdminPortal/PageUpdate';
import './js/React/AdminPortal/SystemSettings';
import './js/React/AdminPortal/ManageMedia';
import './js/React/CMS-Blocks/Text';
import './js/React/AdminPortal/App/FactFiles';
import './js/React/AdminPortal/App/Quizzes';
import './js/React/AdminPortal/App/Tracks';
import './js/React/AdminPortal/App/Settings';
import './js/React/AdminPortal/Noticeboard';

/* React Error Pages */
import './js/React/Errors/Inactive';
import './js/React/Errors/PasswordExpired';
import './js/React/Errors/InternalServerError';

/* React - Page Templates */
import './js/React/PageTemplates/BasePage';

/* Theme */
//import './js/app.min';
