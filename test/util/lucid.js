"use strict";

var expect = require("expect.js")
var lucid = require("../../util/lucid")

describe("lucid", function(){

        it('Set allows you to bind to an event even after it has happened', function(){
            var emitter = new lucid()
            emitter.set('ready')

            var triggered = false
            
            emitter.on('ready', function() {
                triggered = true
            });
            
            expect(triggered).to.be.ok()
        })
        
         var fooOnA, 
            barOnB, 
            bazOnB , 
            arianOnC

        it('can pipe other emitter', function(){
            var centralEmitter = new lucid()
            var emitterA = new lucid()
            var emitterB = new lucid()
            var emitterC = new lucid()

            //pipe the foo event from emitter A
            centralEmitter.pipe('foo', emitterA)

            //pipe the bar and baz event from emitter B
            centralEmitter.pipe(['bar', 'baz'], emitterB)

            //pipe all events from emitter C
            centralEmitter.pipe(emitterC)
            
           
            
            centralEmitter.on('foo', function(){
                fooOnA = true 
            })
            
            centralEmitter.on('bar', function(){
                barOnB = true
            })
            
            centralEmitter.on('baz', function(){
                bazOnB = true
            })
            
            centralEmitter.on('arian', function(){
                arianOnC = true
            })
            
            emitterA.emit('foo')
            emitterB.emit('bar')
            emitterB.emit('baz')
            emitterC.emit('arian')
            
            expect(fooOnA).to.be.ok()
            expect(barOnB).to.be.ok()
            expect(bazOnB).to.be.ok()
            expect(arianOnC).to.be.ok()
        })
        
        it('handles sub events',function(){
            var emitter = new lucid()
            var foobar, foo
            emitter.on('foo.bar', function() {
                foobar = 'foo.bar'
            })
            emitter.on('foo', function() {
                foo = 'foo'
            })
            
            emitter.emit('foo.bar.baz')
            
            expect(foobar).to.be('foo.bar')
            expect(foo).to.be(foo)
        })
        
        it('has :listener pseudos', function(){
            var emitter = new lucid()
            emitter.on(':listener', function(event, listeners) {
                expect(event).to.be('foo')
            })
            emitter.on('foo', function() { console.log('bar') })
        })
        
        it('has :event pseudos', function(){
            var emitter = new lucid()
            emitter.on(':event', function(event) {
                expect(event).to.be('foo')
            })
            emitter.emit('foo')
        })
})
