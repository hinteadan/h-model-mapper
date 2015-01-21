(function() {
    'use strict';

    function ConstructorInfo(constructor, children, isFactory) {
        /// <param name="constructor" type="function" />
        /// <param name="children" type="Object" elementType="ConstructorInfo" />
        this.constructor = constructor;
        this.children = children;
        this.build = function(dto) {
            return isFactory ? this.constructor(dto) : new this.constructor();
        };
        this.hasChild = function(name) {
            return this.children ? Boolean(this.children[name]) : false;
        };
    }

    function constructFromDto(dto, constructorInfo) {
        /// <param name="constructorInfo" type="ConstructorInfo" />
        var model = constructorInfo.build(dto);
        for (var property in dto) {
            if (constructorInfo.hasChild(property)) {
                model[property] = constructFromDto(dto[property], constructorInfo.children[property]);
                continue;
            }
            model[property] = dto[property];
        }
        return model;
    }

    this.H = this.H || {};
    this.H.ModelMapper = {
        ConstructorInfo: ConstructorInfo,
        constructFromDto: constructFromDto
    };

})();
