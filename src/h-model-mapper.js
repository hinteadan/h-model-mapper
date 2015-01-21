(function() {
    'use strict';

    function toJsCase(name){
        if(!angular.isString(name) || !name.length){
            return name;
        }
        return name[0].toLowerCase() + name.substr(1);
    }

    function ConstructorInfo(constructor, children, forceJsCasing, isFactory) {
        /// <param name="constructor" type="function" />
        /// <param name="children" type="Object" elementType="ConstructorInfo" />
        this.constructor = constructor;
        this.children = children;
        this.forceJsCasing = Boolean(forceJsCasing);
        this.build = function(dto) {
            return isFactory ? this.constructor(dto) : new this.constructor();
        };
        this.hasChild = function(name) {
            return this.children ? Boolean(this.children[name]) || Boolean(this.children[toJsCase(name)]) : false;
        };
    }

    function constructFromDto(dto, constructorInfo) {
        /// <param name="constructorInfo" type="ConstructorInfo" />
        var model = constructorInfo.build(dto);
        for (var property in dto) {
            if (constructorInfo.hasChild(property)) {
                model[constructorInfo.forceJsCasing ? toJsCase(property) : property] = constructFromDto(dto[property], constructorInfo.children[property]);
                continue;
            }
            model[constructorInfo.forceJsCasing ? toJsCase(property) : property] = dto[property];
        }
        return model;
    }

    this.H = this.H || {};
    this.H.ModelMapper = {
        ConstructorInfo: ConstructorInfo,
        constructFromDto: constructFromDto
    };

}).call(this);
