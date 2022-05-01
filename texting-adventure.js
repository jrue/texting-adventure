/**************************
jQuery Texting Adventure by Jeremy Rue https://github.com/jrue

LICENSE: CC BY-NC-SA Attribution-NonCommercial-ShareAlike

You are free to remix, adapt, and build upon this work non-commercially, as long as you credit me and license the new creations under the identical terms. 

https://creativecommons.org/licenses/by-nc-sa/4.0/
**************************/
 

(function( $ ){
  $.textingAdventure = function(el, data, options){

    var base = this;

    // Access to jQuery and DOM versions of element
    base.$el = $(el);
    base.el = el;
    

    // Add a reverse reference to the DOM object
    base.$el.data("texting-adventure", base);
    

    base.init = function(){
      
      base.options = $.extend({},$.textingAdventure.defaultOptions, options);
      
      base.data = data;

      jQuery.extend( jQuery.easing, {easeOutCubic: function (x, t, b, c, d) {return c*((t=t/d-1)*t*t + 1) + b;}});
      
      //attach message holder to the div they called this plugin on
      base.options.messageHolder.appendTo(base.$el);
      
      //add CSS styles
      base.addCSSStyles();
       
    };
    
    base.createQuestion = function(d, first){
      
      var who;
      var message = $("<p />");
      var delay = 0;
      
      //did they include a message?
      if(d.hasOwnProperty("message")){
        //add message
        message.html(d.message);
        //if it's only an emoji, no background
        if(base.emojis.test(d.message)){
          message.addClass("emoji no-tail");
        }
      }
      
      //who is the message from?
      if(d.hasOwnProperty("who")){
        
        if(base.options.messageTails === false){
          message.addClass("no-tail");
        }
        
        if(d.who.toLowerCase().replace(/\s+/g, '') == "fromthem"){
          message.addClass("from-them");
          who = "from-them";
        }
        if(d.who.toLowerCase().replace(/\s+/g, '') == "fromme"){
          message.addClass("from-me");
          who = "from-me";
        }
      } else { //No from message, then assume it's from them.
          message.addClass("from-them");
          who = "from-them";
      }

      //append to the holder
      if(d.hasOwnProperty("message")){
        message.appendTo(base.options.messageHolder);
      }
      
      //to activate CSS transition, we need a 0 timeout
      window.setTimeout(function() { $(".textadventure p").addClass("in"); }, 0);
      
      
      //if there are choices
      if(d.hasOwnProperty("choices") && d.choices.length > 0){
        
        var questionChoices = $("<div />")
          .attr("id", "imessage-choices");
        
        var optionText = "";
        
        d.choices.forEach(function(j,k){
          
          if(j.hasOwnProperty("ifChosenGoTo")){
            var goto = j.ifChosenGoTo;
          } else {
            var goto = 0;
          }
          
          if(j.hasOwnProperty("option")){
            optionText = j.option;
          } else {
            optionText = "Option " + (k + 1).toString();
          }
          
          
          $("<button />")
            .addClass("btn textadventure-choices")
            .attr("type","button")
            .text(optionText)
            .on("click", function(){
            
              $("#imessage-choices").remove();
            
              if(goto != 0){
                //add loading image with id #imessage-thinking
                $("<img />").attr("id", "imessage-thinking")
                  .attr("src", base.options.loadingSVG)
                  .addClass("from-me")
                  .css({'height':'40px','width':'55px'})
                  .appendTo(base.options.messageHolder);

                window.setTimeout(base.activateQuestions.bind({goto:goto}), d.delay * 1000);
              }
            })
            .appendTo(questionChoices);
        });
        questionChoices.appendTo(base.options.messageHolder);
        window.setTimeout(function() { $(".textadventure-choices").addClass("in"); }, 0);
      } else {
        
        if(d.hasOwnProperty("goto")){
        
          //no choices
          $("<img />").attr("id", "imessage-thinking")
            .attr("src", base.options.loadingSVG)
            .addClass("from-them")
            .css({'height':'40px','width':'55px'})
            .appendTo(base.options.messageHolder);

          window.setTimeout(base.activateQuestions.bind({goto:d.goto}), d.delay * 1000);
        }
        
      }


    }
    
    
    base.activateQuestions = function(){
      
      $("#imessage-thinking").remove();
      
      //let goto = $(this).data('adventure-goto');
      base.createQuestion(base.findObjectByKey(base.data, "id", this.goto), false);
      
    }
    
    

    /**
     * Find Object By Key
     * @param  {Array} [array] Array to search
     * @param  {String} [key] The key of the object
     * @param  {Mixed} [value] Which value to match.
     * @return {Mixed} Either null or value found
     * @api private
     */  
    base.findObjectByKey = function(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
          return array[i];
        }
      }
      return null;
    }
    
    base.addCSSStyles = function(){
        //needed CSS styles for the look and feel of messages.
        $('head').append('<style>.textadventure { background-color: #fff; border-radius: 0.25rem; display: flex; flex-direction: column; font-family: "SanFrancisco", Helvetica, Arial, san-serif; font-size: 1.25rem; margin: 0 auto 1rem; max-width: 600px; padding: 0.5rem 1.5rem;}.textadventure p { border-radius: 1.15rem; line-height: 1.25; max-width: 75%; padding: 0.5rem .875rem; position: relative; word-wrap: break-word; opacity: 0; transition: opacity 0.1s linear; transition-delay:0;}.textadventure p.in,button.in{ opacity: 1;}.textadventure p::before,.textadventure p::after { bottom: -0.1rem; content: ""; height: 1rem; position: absolute;}p.from-me{ align-self: flex-end; background-color:' + base.options.textMessageColor + '; color: #fff; }img.from-me{ align-self: flex-end;}p.from-me::before { border-bottom-left-radius: 0.8rem 0.7rem; border-right: 1rem solid ' + base.options.textMessageColor + '; right: -0.35rem; transform: translate(0, -0.1rem);}p.from-me::after { background-color: #fff; border-bottom-left-radius: 0.5rem; right: -40px; transform:translate(-30px, -2px); width: 10px;}p[class^="from-"] { margin: 0.5rem 0; width: fit-content;}p.from-them { align-items: flex-start; background-color: #e5e5ea; color: #000;}p.from-them:before { border-bottom-right-radius: 0.8rem 0.7rem; border-left: 1rem solid #e5e5ea; left: -0.35rem; transform: translate(0, -0.1rem);}p.from-them::after { background-color: #fff; border-bottom-right-radius: 0.5rem; left: 20px; transform: translate(-30px, -2px); width: 10px;}p.emoji { background: none; font-size: 3.5rem; margin:0.5rem}p.emoji::before { content: none;}.no-tail::before { display: none;}.btn{ display:block;font-weight:400;line-height:1.5;text-align:center;vertical-align:middle;border:1px solid transparent;padding:0.375rem 0.75rem;font-size:1rem;border-radius:0.25rem;background-color:#6c757d;margin:0.5rem auto;width:75%;color:#fff;cursor:pointer; transition: opacity 0.1s; opacity: 0;}.btn:hover{ background-color:#aaa; }</style>');
    }
    
    //find only emojis and spaces. Allow skin tones as well. Might not be exhaustive
    base.emojis = /^\s*\p{Emoji_Modifier_Base}?(\p{Emoji_Presentation}|\p{Extended_Pictographic}|\s+)+\s*$/gu;
    

    // Run initializer
    base.init();
  };

  $.textingAdventure.defaultOptions = {
    
    //the div that holds everything, globally accessible.
    messageHolder: $("<div />").addClass("textadventure"),
    
    //iMessage blue
    textMessageColor: "#248bf5",
    
    //non-iOS green color
    //textMessageColor: "#43CC47",
    
    //include tails on the messages?
    messageTails: true,
    
    loadingSVG: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBoZWlnaHQ9IjQwIiB3aWR0aD0iNTUiPgogIDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+CiAgICBAa2V5ZnJhbWVzIGJsaW5rIHsgNTAlIHsgZmlsbDogdHJhbnNwYXJlbnQgfX0KICAgIC5kb3QgeyAKICAgICAgYW5pbWF0aW9uOiAxcyBibGluayBpbmZpbml0ZTsKICAgICAgZmlsbDogZ3JleTsKICAgIH0KICAgIC5kb3Q6bnRoLWNoaWxkKDIpIHsgYW5pbWF0aW9uLWRlbGF5OiAyNTBtcyB9CiAgICAuZG90Om50aC1jaGlsZCgzKSB7IGFuaW1hdGlvbi1kZWxheTogNTAwbXMgfQoKICAgIC5sb2FkZXIgewogICAgICBzdHJva2U6ICNmMWYxZjE7CiAgICAgIHN0cm9rZS13aWR0aDogNDBweDsKICAgICAgc3Ryb2tlLWxpbmVjYXA6IHJvdW5kOwogICAgfQogIDwvc3R5bGU+CiAgPHBhdGggZD0iTTIwLDIwIGgxNSIgY2xhc3M9ImxvYWRlciI+PC9wYXRoPgogIDxjaXJjbGUgY2xhc3M9ImRvdCIgY3g9IjE2IiBjeT0iMjAiIHI9IjMiIHN0eWxlPSJmaWxsOmdyZXk7IiAvPgogIDxjaXJjbGUgY2xhc3M9ImRvdCIgY3g9IjI2IiBjeT0iMjAiIHI9IjMiIHN0eWxlPSJmaWxsOmdyZXk7IiAvPgogIDxjaXJjbGUgY2xhc3M9ImRvdCIgY3g9IjM2IiBjeT0iMjAiIHI9IjMiIHN0eWxlPSJmaWxsOmdyZXk7IiAvPgo8L3N2Zz4="
  };

  $.fn.textingAdventure = function(data, options){
    return this.each(function(){
      
      const adventure  = (new $.textingAdventure(this, data, options));
      
      //start with first question
      adventure.createQuestion(adventure.data[0], true);

    });
  };
    
})(jQuery);