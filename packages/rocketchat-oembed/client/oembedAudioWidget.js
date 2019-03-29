import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { getUserPreference } from 'meteor/rocketchat:utils';

Template.oembedAudioWidget.helpers({
	collapsed() {
		if (this.collapsed != null) {
			return this.collapsed;
		} else {
			return getUserPreference(Meteor.userId(), 'collapseMediaByDefault') === true;
		}
	},
});
