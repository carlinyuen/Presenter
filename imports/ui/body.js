
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/videos.js';

import './body.html';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('videos');
});

Template.checker.helpers({
  counter: function () {
    return Videos.find().count();
  }
});

Template.checker.events({
  'click button': function () {
    alert(Videos.find().count());
  }
});

Template.recordedVideo.events({
  'click .delete'() {
    Meteor.call('videos.remove', this._id);
  },
});

Template.body.helpers({
  videos() {
    return Videos.find({}, {sort: {dateCreated: -1}});
  },
});

// if (Meteor.isClient) {
//
//   // counter starts at 0
//   Meteor.subscribe('videos');
//
//   Template.body.onCreated(function bodyOnCreated() {
//   });
//
//   Template.checker.helpers({
//     counter: function () {
//       return Videos.find().count();
//     }
//   });
//
//   Template.checker.events({
//     'click button': function () {
//       alert(Videos.find().count());
//     }
//   });
//
//   Template.recordedVideo.events({
//     'click .delete'() {
//       Meteor.call('videos.remove', this._id);
//     },
//   });
//
//   Template.body.helpers({
//     videos() {
//       return Videos.find({}, {sort: {dateCreated: -1}});
//     },
//   });
// }
//
// if (Meteor.isServer) {
//   Meteor.startup(function () {
//   });
// }
