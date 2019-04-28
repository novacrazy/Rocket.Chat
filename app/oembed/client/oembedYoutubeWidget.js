import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { getUserPreference } from '../../utils';

Template.oembedYoutubeWidget.helpers({
	collapsed() {
		if (this.collapsed != null) {
			return this.collapsed;
		} else {
			return getUserPreference(Meteor.userId(), 'collapseMediaByDefault') === true;
		}
	},
});
