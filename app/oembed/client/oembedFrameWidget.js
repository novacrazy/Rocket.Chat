import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { getUserPreference } from '../../utils';

Template.oembedFrameWidget.helpers({
	collapsed() {
		if (this.collapsed != null) {
			return this.collapsed;
		}
		return getUserPreference(Meteor.userId(), 'collapseMediaByDefault') === true;
	},
});
