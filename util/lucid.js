/*
Lucid
- Name and API inspired by LucidJS by RobertWHurst https://github.com/RobertWHurst/LucidJS, Copyright 2012 Robert Hurst. All rights reserved.
- MIT-License
 */"use strict"

var UID = 0,
    ID = function(){return 'ID' + (UID++).toString(36)},
    pipes = {},
    prime = require('prime'),
    type  = require('prime/util/type'),
    array = require("prime/es5/array"),
    lucid = prime({
       inherits : require('prime/util/emitter'), 
       constructor: function(){
           this._UID = ID()
       },
       set: function(event){
           var setted = (this._setters || (this._setters = []))
           setted.push(event)
           return this
       },
       on: function(event, fn){
           var setters = this._setters;
           lucid.parent.on.apply(this, arguments)
           
           array.forEach(setters || [], function(setter){
                   if (setter == event) fn.apply(this)    
           }, this)
           
           if(event != ':listener' && event != ':event') this.emit(':listener', event, fn)
           return this
       },
       emit: function(event){
           var args = arguments           
           lucid.parent.emit.apply(this, args)
           
           var attached = pipes[this._UID]
          
           array.forEach(attached || [], function(piped){
                var events = piped.events,
                    target = piped.target
                
                array.forEach(type(events) == 'array' ? events : [events], function(pipedEvent){
                   if (pipedEvent == event || pipedEvent == '*'){
                        target.emit.apply(target, args) 
                   }
                })
           })
           
           args = (arguments.length > 1) ? array.slice(arguments, 1) : [];
           var subs = event.split('.'), 
           subevent
           
           while (subs.pop()){
               if (subevent = subs.join('.')){
                   this.emit(subevent, args)
               }
           }
           
           if (event != ':event' && event != ':listener') this.emit(':event', event, args);
           return this
       },
       pipe:function(events, target){
           if (!target){
               target = events
               events = '*'
           }
           var uid = target._UID || (target._UID = ID());
           var attached = pipes[uid] || (pipes[uid] = [])
           attached.push({target: this, events: events})
           
           return this
       }

})

module.exports = lucid;
