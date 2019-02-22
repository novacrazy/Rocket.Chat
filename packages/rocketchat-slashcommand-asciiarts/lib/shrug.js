import { Meteor } from 'meteor/meteor';
import { slashCommands } from 'meteor/rocketchat:utils';
import { settings } from 'meteor/rocketchat:settings';
/*
* Shrug is a named function that will replace /shrug commands
* @param {Object} message - The message object
*/


function Shrug(command, params, item) {
	if (command === 'shrug') {
		const msg = item;

		if (settings.get('Markdown_Parser') === 'marked') {
			msg.msg = `${ params } ¯\\\\_(ツ)_/¯`;
		} else {
			msg.msg = `${ params } ¯\\_(ツ)_/¯`;
		}

		Meteor.call('sendMessage', msg);
	}
}

slashCommands.add('shrug', Shrug, {
	description: 'Slash_Shrug_Description',
	params: 'your_message_optional',
});
