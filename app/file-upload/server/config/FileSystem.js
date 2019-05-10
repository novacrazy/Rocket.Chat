import fs from 'fs';

import { Meteor } from 'meteor/meteor';
import { UploadFS } from 'meteor/jalik:ufs';
import _ from 'underscore';
import etag from 'etag';
import fresh from 'fresh';

import { settings } from '../../../settings';
import { FileUploadClass, FileUpload } from '../lib/FileUpload';

const FileSystemUploads = new FileUploadClass({
	name: 'FileSystem:Uploads',
	// store setted bellow

	get(file, req, res) {
		const filePath = this.store.getFilePath(file._id, file);

		try {
			const stat = Meteor.wrapAsync(fs.stat)(filePath);

			if (stat && stat.isFile()) {
				file = FileUpload.addExtensionTo(file);

				res.setHeader('Last-Modified', file.uploadedAt.toUTCString());
				res.setHeader('ETag', etag(stat));

				if(fresh(req.headers, {
					'etag': res.getHeader('ETag'),
					'last-modified': res.getHeader('Last-Modified')
				})) {
					res.statusCode = 304;
					res.end(); // No content for 304

				} else {
					res.setHeader('Content-Disposition', `inline; filename*=UTF-8''${ encodeURIComponent(file.name) }`);
					res.setHeader('Content-Type', file.type);
					res.setHeader('Content-Length', file.size);

					this.store.getReadStream(file._id, file).pipe(res);
				}
			}
		} catch (e) {
			res.writeHead(404);
			res.end();
		}
	},

	copy(file, out) {
		const filePath = this.store.getFilePath(file._id, file);
		try {
			const stat = Meteor.wrapAsync(fs.stat)(filePath);

			if (stat && stat.isFile()) {
				file = FileUpload.addExtensionTo(file);

				this.store.getReadStream(file._id, file).pipe(out);
			}
		} catch (e) {
			out.end();
		}
	},
});

const FileSystemAvatars = new FileUploadClass({
	name: 'FileSystem:Avatars',
	// store setted bellow

	get(file, req, res) {
		const filePath = this.store.getFilePath(file._id, file);

		try {
			const stat = Meteor.wrapAsync(fs.stat)(filePath);

			if (stat && stat.isFile()) {
				file = FileUpload.addExtensionTo(file);

				res.setHeader('Last-Modified', file.uploadedAt.toUTCString());
				res.setHeader('ETag', etag(stat));

				if(fresh(req.headers, {
					'etag': res.getHeader('ETag'),
					'last-modified': res.getHeader('Last-Modified')
				})) {
					res.statusCode = 304;
					res.end(); // No content for 304

				} else {
					res.setHeader('Content-Disposition', `inline; filename*=UTF-8''${ encodeURIComponent(file.name) }`);
					res.setHeader('Content-Type', file.type);
					res.setHeader('Content-Length', file.size);

					this.store.getReadStream(file._id, file).pipe(res);
				}
			}
		} catch (e) {
			res.writeHead(404);
			res.end();
		}
	},
});

const FileSystemUserDataFiles = new FileUploadClass({
	name: 'FileSystem:UserDataFiles',

	get(file, req, res) {
		const filePath = this.store.getFilePath(file._id, file);

		try {
			const stat = Meteor.wrapAsync(fs.stat)(filePath);

			if (stat && stat.isFile()) {
				file = FileUpload.addExtensionTo(file);

				res.setHeader('Last-Modified', file.uploadedAt.toUTCString());
				res.setHeader('ETag', etag(stat));

				if(fresh(req.headers, {
					'etag': res.getHeader('ETag'),
					'last-modified': res.getHeader('Last-Modified')
				})) {
					res.statusCode = 304;
					res.end(); // No content for 304

				} else {
					res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${ encodeURIComponent(file.name) }`);
					res.setHeader('Content-Type', file.type);
					res.setHeader('Content-Length', file.size);

					this.store.getReadStream(file._id, file).pipe(res);
				}
			}
		} catch (e) {
			res.writeHead(404);
			res.end();
		}
	},
});

const createFileSystemStore = _.debounce(function() {
	const options = {
		path: settings.get('FileUpload_FileSystemPath'), // '/tmp/uploads/photos',
	};

	FileSystemUploads.store = FileUpload.configureUploadsStore('Local', FileSystemUploads.name, options);
	FileSystemAvatars.store = FileUpload.configureUploadsStore('Local', FileSystemAvatars.name, options);
	FileSystemUserDataFiles.store = FileUpload.configureUploadsStore('Local', FileSystemUserDataFiles.name, options);

	// DEPRECATED backwards compatibililty (remove)
	UploadFS.getStores().fileSystem = UploadFS.getStores()[FileSystemUploads.name];
}, 500);

settings.get('FileUpload_FileSystemPath', createFileSystemStore);
