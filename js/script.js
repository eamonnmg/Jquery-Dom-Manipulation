/**
 * Created by l00093050 on 25/02/2015.
 */


//globals

var startPos = 0; //start pos index for siblings
var sibPos = 0; //sibling index of selected node
var selectedNode = $('.node').first(); // the currently selected node - initialised to the first node on start up
var endPos = 0 ; // this will be reused for both sibs and parents
var siblings = []; // store all siblings in gloabal array





(function(){
    //initialise selected css
    selectedNode.addClass('selected');

    //add event to next button
    $('#next-sib').click(function(){
        nextSib()
    });

    //add event to previous button
    $('#previous-sib').click(function(){
        previousSib()
    });

    //event to navigate up generation
    $('#upGen').click(function(){
        upGen();
    });

    //event to navigate down generation
    $('#downGen').click(function(){
        downGen();
    });

    //clicking on any node will select it
    $('div.tree').on('click','.node', function(){
        selectedNode = $(this);
        $('.node').removeClass('selected');
        selectedNode.addClass('selected');
    });

    //add child btn event
    $('#add').on('click',function(){
        bootboxAdd(selectedNode);
    });

    //remove button event - calls remove method
    $('#remove').on('click',function(){
        removeNode(selectedNode);
    });

    //edit button event - calls edit event
    $('#edit').on('click',function(){
        bootboxEdit(selectedNode);
    });

    //view dom ebtn event
    $('#viewDom').on('click',function(){
        //change dom dive css to visable
        var dom = $('#dom').css('display');
        if(dom == 'none'){
            //update dom output
            updateDom();
            $('#dom').toggle().css('display','inline')
        }else{
            $('#dom').toggle().css('display','none')
        }
    });
})();

//move up a generation
function upGen(){
    //get index of selcted node
    var nodeIndex = $('.node').index(selectedNode);
    //if position does not == start position ie first node
    if(nodeIndex != 0){
        selectedNode = $(selectedNode).parents().eq(2).find('.node').first();
    }else{
        log('At begining node');
    }

    //style selected node
    $('.node').removeClass('selected');
    selectedNode.addClass('selected');
}
//move down a generation
function downGen(){
    //reset sib pos counter ie start at left most child
    sibPos = 0;
    if(selectedNode.siblings('ul').length>0){
        //moving down generation, must be children of selected node
        selectedNode = selectedNode.siblings('ul').find('.node').first();

        //style selected node
        $('.node').removeClass('selected');
        selectedNode.addClass('selected');
    }else{
        log('No more children');
    }
}

//move left sibling
function previousSib(){
    //set indexes of counters based on the amount of siblings
    endPos = $(selectedNode).parent().siblings('li').length;
    siblings = $(selectedNode).parent().parent().children('li').children('.node');

    //if not first sibling move
    if(sibPos != startPos){
        sibPos--;
    }else{
        log('First sibling is selected - no more siblings to the left')
    }


    //style selected node
    selectedNode = siblings.eq(sibPos);
    $('.node').removeClass('selected');
    selectedNode.addClass('selected');
}

//move right sibling - reverse of previousSib func
function nextSib(){
    endPos = $(selectedNode).parent().siblings('li').length;
    siblings = $(selectedNode).parent().parent().children('li').children('.node');

    if(sibPos != endPos){
        sibPos++;
    }else{
        log('Last sibling is selected - no more to right')
    }

    //style selected node
    selectedNode = siblings.eq(sibPos);
    $('.node').removeClass('selected');
    selectedNode.addClass('selected');
}

//add child node to selected node
function addChild(name, dob,img, target){
    //get number of siblings/parents
    var childCount = $(target).siblings('ul').children('li').length;

    //no child case
    if(childCount <1){
        $('<ul></ul>').append(
            '<li>'+
            drawNode(name,dob,img)+
            '</li>'
        ).insertAfter(target);
    }

    //is one child case
    if(childCount >= 1 ){
        //console.log($(this).siblings());
        $('<li></li>').append(

            drawNode(name,dob,img)

        ).appendTo($(target).siblings());
    }

    //update length of node list
    endPos = $('.node').length ;
}

//remove/delete node
function removeNode(target){
    //get child and sibling count of selected node(ie target)
    var childCount = $(target).siblings('ul').children('li').length;
    var siblingCount = $(target).parent().siblings('li').length;

    //cant delete root node
    if(childCount == 0 && $('.node').index(target) != 0){

        //reset selected to previous .node div
        //this must be done before node is removed
        selectedNode = $('.node').eq($('.node').index(target) - 1 );
        $('.node').removeClass('selected');
        selectedNode.addClass('selected');

        //if there is more than node sibling
        if(siblingCount >= 1){
            $(target).parent().remove();
        }
        //if there is less than node sibling
        if(siblingCount == 0){
            $(target).parent().parent().remove();
        }

    }else{
        log('Can not delete node that has children or is root');
    }





}


//simple function to print out a node with given values
function drawNode(name,dob,img){
    return '<div class="node">' +
        '<div class="profileImg" ><img src="'+img+'"></div>' +
        '<table>' +
        '<tr>' +
        '<td>Name:</td>' +
        '<td class="name-field">'+name+'</td>' +
        '</tr>' +
        '<tr>' +
        '<td>DOB:</td>' +
        '<td class="dob-field">'+dob+'</td>' +
        '</tr>' +

        '</table>' +

        '</div>'
}

//triggers a boot box form to take in the values need to consturct a new node
//source: http://bootboxjs.com/
function bootboxAdd(target){
    bootbox.dialog({
            title: "Enter Ancestor Details",
            message: '<div class="row">  ' +
            '<div class="col-md-12"> ' +
            '<form class="form-horizontal"> ' +
            '<div class="form-group"> ' +
            '<label class="col-md-4 control-label" for="name">Name</label> ' +
            '<div class="col-md-4"> ' +
            '<input id="name" name="name" type="text" placeholder="Ancestor name" class="form-control input-md"> ' +
            '<span class="help-block"></span> </div> ' +
            '</div> ' +
            '<div class="form-group"> ' +
            '<label class="col-md-4 control-label" for="dob">DOB</label> ' +
            '<div class="col-md-4"> ' +
            '<input id="dob" name="dob" type="date" placeholder="Ancestor DOB Here" class="form-control input-md"> ' +
            '<span class="help-block"></span> </div> ' +
            '</div> ' +
            '<div class="form-group"> ' +
            '<label class="col-md-4 control-label" for="dob">Image</label> ' +
            '<div class="col-md-4"> ' +
            '<form id="imgUploadForm" runat="server">'+
            '<input type="file" id="imgInp" />' +
            '<img id="uploadedImg" src="imgs/default.jpg" alt="your image"/>' +
            '<input type="button" id="removeImg" value="Remove Image" />'+
            '</form>' +
            '</div> </div>' +
            '</div> </div>'+
            '</div>  </div>',
            buttons: {
                success: {
                    label: "Add",
                    className: "btn-success",
                    callback: function () {
                        var name = $('#name').val();
                        var dob = $("#dob").val();
                        var img = $("#uploadedImg").attr('src');
                        //pass vals into add parent function
                        addChild(name, dob, img, target);
                    }
                }
            }
        }
    );
    //souce: http://jsfiddle.net/LvsYc/
    //when a file is uploaded call the readURL function
    $("#imgInp").change(function(){
        readURL(this);
    });

    //remove image event
    $("#removeImg").click(function(){
        //reset img source to defualt
        $('#uploadedImg').attr('src','imgs/default.jpg');
    });

}



//triggets bootbox form to edit selected node
function bootboxEdit(target){
    //get existing values to poultate initial form with
    var currentImg = $('img',target).attr('src');
    var currentName = $('.name-field',target).html();
    var currentDob = $('.dob-field',target).html();

    bootbox.dialog({
            title: "Enter Ancestor Details",
            message: '<div class="row">  ' +
            '<div class="col-md-12"> ' +
            '<form class="form-horizontal"> ' +
            '<div class="form-group"> ' +
            '<label class="col-md-4 control-label" for="name">Name</label> ' +
            '<div class="col-md-4"> ' +
            '<input id="name" name="name" type="text" value="'+currentName+'" placeholder="Ancestor name" class="form-control input-md"> ' +
            '<span class="help-block"></span> </div> ' +
            '</div> ' +
            '<div class="form-group"> ' +
            '<label class="col-md-4 control-label" for="dob">DOB</label> ' +
            '<div class="col-md-4"> ' +
            '<input id="dob" name="dob" type="date" value="'+currentDob+'" placeholder="Ancestor DOB Here" class="form-control input-md"> ' +
            '<span class="help-block"></span> </div> ' +
            '</div> ' +
            '<div class="form-group"> ' +
            '<label class="col-md-4 control-label" for="dob">Image</label> ' +
            '<div class="col-md-4"> ' +
            '<form id="imgUploadForm" runat="server">'+
            '<input type="file" id="imgInp" />' +
            '<img id="uploadedImg" src="'+currentImg+'" alt="your image"/>' +
            '<input type="button" id="removeImg" value="Remove Image" />'+
            '</form>' +
            '</div> </div>' +
            '</div> </div>'+
            '</div>  </div>',
            buttons: {
                success: {
                    label: "Edit",
                    className: "btn-success",
                    callback: function () {
                        var name = $('#name').val();
                        var dob = $("#dob").val();
                        var img = $("#uploadedImg").attr('src');

                        $('.name-field', target).html(name);
                        $('.dob-field', target).html(dob);
                        $('.profileImg img', target).attr('src',img);


                    }
                }
            }
        }
    );

    //souce: http://jsfiddle.net/LvsYc/
    //when a file is uploaded call the readURL function
    $("#imgInp").change(function(){
        readURL(this);
    });

    //remove image event
    $("#removeImg").click(function(){
        //reset img source to defualt
        $('#uploadedImg').attr('src','imgs/default.jpg');
    });



}

//source http://jsfiddle.net/LvsYc/
//this function facilitates the upload of image files
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#uploadedImg').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

//print events in log div
function log(text){
    var date = new Date();
    $('#log').prepend('<span class="time">'+date.toLocaleString()+':</span>'+text+'<br>');
}

function updateDom(){
    //remove img urls from dom
    var domTree = $('#main').clone();
    $(domTree).find('img').attr('src','#');
    domTree = $(domTree).html();
    $('#dom').text(domTree);
}
