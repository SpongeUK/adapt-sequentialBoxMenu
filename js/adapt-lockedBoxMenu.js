define(function(require) {

    var Backbone = require('backbone'),
        Adapt = require('coreJS/adapt'),
        MenuView = require('coreViews/menuView'),
        _ = require('underscore');
    
    var BoxMenuView = MenuView.extend({
        
        postRender: function() {
            var nthChild = 0,
                locked = false;

            this.model.getChildren().each(function(item) {
                if(item.get('_isAvailable')) {
                    nthChild ++;
                    item.set('_isLocked', locked);
                    var menuItem = new BoxMenuItemView({model:item, nthChild:nthChild});
                    locked = !menuItem.isComplete() || locked;
                    this.$('.menu-container-inner').append(menuItem.$el);
                }
            });
        }

    }, {
        template:'boxmenu'
    });

    var BoxMenuItemView = MenuView.extend({

        className: function() {
           console.log('locked?', this.model.get('_isLocked'));
            return [
                'menu-item',
                'menu-item-' + this.model.get('_id'),
                'nth-child-' + this.options.nthChild,
                this.options.nthChild % 2 === 0  ? 'nth-child-even' : 'nth-child-odd',
                this.model.get('_isLocked') ? 'locked' : ''
            ].join(' ');
        },

        preRender: function() {

        },

        postRender: function() {
            this.$el.imageready(_.bind(function() {
                this.setReadyStatus();
            }, this));
            if(this.isComplete()) {
                this.$el.addClass('complete').removeClass('incomplete');
            } else {
                this.$el.addClass('incomplete').removeClass('complete');
            }
        },

        isComplete: function() {
            return this.model.get('_isComplete') || this.model.getChildren().every(function (item) {
                return item.get('_isComplete');
            });
        }

    }, {
        template:'boxmenu-item'
    });
    
    Adapt.on('router:menu', function(model) {
        $('#wrapper').append(new BoxMenuView({model:model}).$el);
    });
    
});
