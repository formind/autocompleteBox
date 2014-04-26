YUI.add('autocomplete-arrow', function (Y, NAME) {

	var build_count	= "1.0.001";

var Lang   = Y.Lang,
    Node   = Y.Node,
    YArray = Y.Array,

    // Whether or not we need an iframe shim.
    useShim = Y.UA.ie && Y.UA.ie < 7,
    
    ID               = 'id',
    LIST             = 'list',

	ARROW_CONTENT	 = '<span title="close">' +
				'<span title="close"></span></span>';
    
	_CLASS_DROPARROW = '_CLASS_DROPARROW';	
	
	function AutoCompleteArrow () { 
		AutoCompleteArrow.superclass.constructor.apply(this, arguments) ;
	}


Y.AutoCompleteArrow = Y.extend(AutoCompleteArrow, Y.AutoCompleteList, {
	
	
		
	DROP_ARROW_TEMPLATE	: '<span/>',
	_dropped			: 0,
	
	
	initializer: function () {
		// The following two function calls allow AutoComplete to attach
		// events to the inputNode and manage the inputNode's browser
		// autocomplete functionality.
		//this._bindUIACBase();
		//this._syncUIACBase();
		Y.log("Y.AutoCompleteArrow initializer ");
		this[_CLASS_DROPARROW] = this.getClassName('dropbutton');
	},
	
	selectItem: function (itemNode, originEvent) {
		if ( this._dropArrowNode && this._dropArrowNode.hasClass("active") ){
			this._dropArrowNode.removeClass("active");
		}
		return Y.AutoCompleteArrow.superclass.selectItem.apply(this, arguments );
	},
	
	_createDropArrow: function () {
        var dropNode = Node.create(this.DROP_ARROW_TEMPLATE);
		var inpx 	 = this._inputNode.getStyle('height');
        dropNode.addClass(this[_CLASS_DROPARROW]).setAttrs({
            id  	: Y.stamp(dropNode)
			});
		dropNode.setStyle('height', this._inputNode.getStyle('height') );
		dropNode.setStyle('width', '30px' );
		return dropNode;
    },
	
	_dropkeydown : function(e){
		if (e.type === "keydown" && e.keyCode === 40 ){
			this._dropArrowNode.addClass("active");
		} else if (e.type === "keydown" && e.keyCode === 13 ){
			this._dropArrowNode.removeClass("active");
		}
	},
	
	_showList : function(e){
		Y.log("_showList");
		var self = this;
		self._dropped = this._dropArrowNode.hasClass("active") === false ? 1 : 0;
		
		this._dropArrowNode.toggleClass("active");
		Y.log( this._dropArrowNode.hasClass("active") );
		
		self._inputNode.focus();
		var request,
            source;
		if (self._dropped === 1 ){
			Y.log(self._inputNode.get("value"));
			source = self.get('source');
			if (source) {
				source.sendRequest({
					query  : "",
					request: null,

					callback: {
						success: Y.bind(self._onResponse, self, "")
					}

				});
			}
			
			if ( self._inputNode.get("value") === "" ){
				
			} else {
				self.show();
				Y.log("show lenne");
			}
			e.stopPropagation();
		} else {
			self.hide();
			Y.log("hide ");
		}
		return self;
	},
	
    renderUI: function () {
        var ariaNode    = this._createAriaNode(),
            boundingBox = this.get('boundingBox'),
            contentBox  = this.get('contentBox'),
            inputNode   = this._inputNode,
            listNode    = this._createListNode(),
            parentNode  = inputNode.get('parentNode');

		
        inputNode.addClass(this.getClassName('input')).setAttrs({
            'aria-autocomplete': LIST,
            'aria-expanded'    : false,
            'aria-owns'        : listNode.get('id')
        });

		if (this.get("withArrow") === false ){
			var dropArrowNode = this._createDropArrow();
			parentNode.append( dropArrowNode );
			//
			this._dropArrowNode = dropArrowNode;
			this._dropArrowNode.on("click", Y.bind("_showList", this) );
			this._inputNode.on("keydown", Y.bind("_dropkeydown", this) );
		}
		
		
		//
        // ARIA node must be outside the widget or announcements won't be made
        // when the widget is hidden.
        parentNode.append(ariaNode);

        // Add an iframe shim for IE6.
        if (useShim) {
            boundingBox.plug(Y.Plugin.Shim);
        }

        this._ariaNode    = ariaNode;
        this._boundingBox = boundingBox;
        this._contentBox  = contentBox;
        this._listNode    = listNode;
        this._parentNode  = parentNode;
		
    }
		
	}, {
			NAME 		: "AutoCompleteArrow",
			ATTRS: {
					
					withArrow : { value : true }
						
			}
		});
		
	Y.AutoCompleteArrow = AutoCompleteArrow;
		
}, '1.0.1', {"requires": [  "base-build",
							"autocomplete-list",
							
							"event-resize",
							"node-screen"]});	
