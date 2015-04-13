/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

 define([
	'backbone',
	'backbone.marionette',
	'utils/XALangSupport',
	'models/VAppState',
	'utils/XAUtils'
],
function(Backbone, Marionette, localization, MAppState, XAUtil){
    'use strict';

	return Backbone.Marionette.AppRouter.extend({
		/** Backbone routes hash */
		appRoutes: {
			""							: "postLoginDefaultView",//"dashboardAction",
			"!/policymanager"			: "serviceManagerAction",

			/****** Analytics Report related **********************/
			"!/reports/userAccess"		: "userAccessReportAction",
			
			/****** Audit Report related **********************/
			"!/reports/audit/:tab"					: "auditReportAction",
			"!/reports/audit/loginSession/:paramName/:id"	: "loginSessionDetail",
			
			/****** User Profile related **********************/
			"!/userprofile"		: "userProfileAction",
			
			"!/users/:tab"		: "userManagerAction",
			"!/user/create"		: "userCreateAction",
			"!/user/:id"		: "userEditAction",
			
			"!/group/create"	: "groupCreateAction",
			"!/group/:id"		: "groupEditAction",

			/************GENERIC UI *****************************************/
			"!/service/:serviceType/create" 	: "serviceCreateAction",
			"!/service/:serviceType/edit/:id"	: "serviceEditAction",
			
			"!/service/:serviceId/policies"			: "policyManageAction",
			"!/service/:serviceId/policies/create"	: "RangerPolicyCreateAction",
			"!/service/:serviceId/policies/:id/edit": "RangerPolicyEditAction",

			/************PERMISSIONS VIEWS *****************************************/
                        "!/permissions": "modulePermissionsAction",
                        "!/permissions/:id/edit"        : "modulePermissionEditAction",
			/*************** ERROR PAGE ****************************************/
			"*actions"					: "pageNotFoundAction"
			
		},
		route: function(route, name, callback) {
			var router = this,
				callbackArgs;
			if (!callback) callback = this[name];
			var proceedWithCallback = function() {
				var currentFragment = Backbone.history.getFragment();
				router.trigger('beforeroute', name);
				callback.apply(router, callbackArgs);
				MAppState.set('previousFragment', currentFragment);
			};

			var overrideCallback = function() {
				callbackArgs = arguments;
				var formStatus = $('.form-horizontal').find('.dirtyField').length > 0 ? true : false
				if (window._preventNavigation && formStatus) {
					bootbox.dialog(window._preventNavigationMsg, [{
						"label": "Stay on this page!",
						"class": "btn-success btn-small",
						"callback": function() {
							router.navigate(MAppState.get('previousFragment'), {
								trigger: false
							});
						}
					}, {
						"label": "Leave this page",
						"class": "btn-danger btn-small",
						"callback": function() {
							XAUtil.allowNavigation();
							proceedWithCallback();
						}
					}]);

				} else {
					proceedWithCallback();
				}
			};
			return Backbone.Router.prototype.route.call(this, route, name, overrideCallback);
		}
	});
});
