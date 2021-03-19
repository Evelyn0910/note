//最左部分折叠与展开
$(".folderHeader").click(function(){
    var body = $(this).next()
    if (!body.is(":hidden")){
        body.hide()
    }else{
        body.show()
    }
})

//最左部分加星笔记点击事件
$("#myStarredNotes").click(function(){
    show_list('star')
})

//最左部分笔记本item点击事件
$("a[id^=notebook_]").click(function(){
    //console.log($(this).attr('id'))
    var notebook_1 =  $(this).attr('id')
    //console.log(/notebook_(\w*)/.exec(notebook_1)[1])
    show_list(/notebook_(\w*)/.exec(notebook_1)[1])
})

//显示list
function show_list(str){
    $('#myNotebookNavForListNav span').text(str+'笔记')
    //给新建按钮传递loalstorage的key
    $('#newMyNote').html('<a id="newNoteBtn" onclick="newNote(\'' + str + '\')"><span class="s-lang">新建</span></a>')
    var collection = localStorage.getItem(str)
    $('#noteItemList').text('');
    if(collection){
        var data=JSON.parse(collection);
        var notestring1 = ''
        var notestring = ''
        for(var i = data.length - 1; i >= 0; i--){
            //233
            notestring1 = '<div class="item-options"><div class="item-star"><i class="img-star" title="加星" onclick="addToStar(\'' + str + '_' + i + '\')"></i></div>' + 
                '<div class="item-del"><i class="img-del" title="删除" onclick="delBtn(\'' + str + '_' + i + '\')"></i></div></div>'
            notestring = '<li class="item">' + notestring1 + 
                '<div class="item-desc" onclick="show_item(\'' + str + '_' + i + '\')"><p class="item-title">' + data[i].title +
                    '</p><p class="item-info"><i class="img-book"></i><span class="note-notebook">' + str + 
                        '</span><i class="img-clock"></i><span class="crted-time">' + data[i].time + 
                            '</span></p><p class="desc">' + data[i].note + '</p></div></li>'
            $('#noteItemList').append(notestring)
         //   $('#noteItemList .item-desc .item-title').text(data[i].title)
         //   $('#noteItemList .item-desc .item-info .note-notebook').text("star")
         //   $('#noteItemList .item-desc .item-info .updated-time').text(data[i].time)
         //   $('#noteItemList .item-desc .desc').text(data[i].note)
        }
    }
}
//显示item的noteAndEditor
function show_item(str){
    var notekey = /(\w*)_(\d*)/.exec(str) //["star_2", "star", "2", index: 0, input: "star_2", groups: undefined]
    var collection = localStorage.getItem(notekey[1])
    var data=JSON.parse(collection);
    if(collection !== "[]"){
        $('#noteTitle').val(data[Number(notekey[2])].title)
        $('#editorContent p').html('<textarea readOnly>' + data[Number(notekey[2])].note + '</textarea>')
        $('.created-time').text(data[Number(notekey[2])].time)
        $('.updated-time').text('')
        $('#editorTool li:first').html('<a id="editBtn" onclick="newNote(\'' + str + '\')"><span class="s-lang">编辑</span></a>')
        $('#editorTool li:last').html('<a id="editDel" onclick="delBtn(\'' + str + '\')"><span class="s-lang">删除</span></a>')
        $('#noteTop').show()
        $('#editor').show()
        $('#nonote').hide()
    }else{
        $('#nonote').show()
        $('#noteTop').hide()
        $('#editor').hide()
    }
}
//编辑note
function newNote(str){
    var strbook = /([a-z]*)_?(\d*)/.exec(str)[1]
    var stritem = /([a-z]*)_?(\d*)/.exec(str)[2]
    //新建的note
    if(stritem === ''){
        $('#mceToolbarContainer .now-time').text(getDateString())
        $('#mceToolbarContainer').show()
        $('#infoToolbar').hide()
        $('#noteTitle').val('')
        $('#editorContent p').html('<textarea type="text" id="noteContent">')
        $('#editorTool li:first').html('<a id="editSureBtn"><span class="s-lang" onclick="keepsure(\'' + str + '\')">确定</span></a>')
        $('#editorTool li:last').hide()
        $('#nonote').hide()
        $('#noteTop').show()
        $('#editor').show()
    }else{
        //已存在的note
        var collection = localStorage.getItem(strbook)
        var data=JSON.parse(collection);
        $('#mceToolbarContainer .now-time').text(getDateString())
        $('#mceToolbarContainer').show()
        $('#infoToolbar').hide()
        $('#noteTitle').val(data[Number(stritem)].title)
        $('#editorContent p').html('<textarea type="text" id="noteContent">')
        $('#noteContent').val(data[Number(stritem)].note)
        $('#editorTool li:first').html('<a id="editSureBtn"><span class="s-lang" onclick="keepsure(\'' + str + '\')">确定</span></a>')
        $('#editorTool li:last').hide()
    }
}

//确定添加/修改
function keepsure(str){
    var strbook = /([a-z]*)_?(\d*)/.exec(str)[1]
    var stritem = /([a-z]*)_?(\d*)/.exec(str)[2]
    //console.log(str)
    var date
    //保存新建note
    if(stritem === ''){
        if($('#noteTitle').val() && $('#noteContent').val()){
            let collection = localStorage.getItem(strbook)
            let data = collection===''?[]:JSON.parse(collection)
            date = getDateString()
            var newnote = {"title": $('#noteTitle').val(), "note": $('#noteContent').val(), "time": date}
            data.push(newnote)
            localStorage.setItem(strbook,JSON.stringify(data))
            stritem = JSON.parse(localStorage.getItem(strbook)).length - 1
            $('#editorContent p textarea').text($('#noteContent').val())
            $('#editorTool li:first').html('<a id="editBtn" onclick="newNote(\'' + strbook + '_' + Number(stritem) + '\')"><span class="s-lang">编辑</span></a>')
            $('#editorTool li:last').html('<a id="editDel" onclick="delBtn(\'' + strbook + '_' + Number(stritem) + '\')"><span class="s-lang">删除</span></a>')
            $('#editorTool li:last').show()
            //console.log(JSON.parse(localStorage.getItem(str)).length-1)
            $('.created-time').text(date)
            $('.updated-time').text('')
            $('#mceToolbarContainer').hide()
            $('#infoToolbar').show()
            show_list(strbook)
            if(strbook === 'star') load()
        }else{
            alert('不可为空')
        }
    }else{
        //修改已存在的note
        let data1 = (JSON.parse(localStorage.getItem(strbook)))
        //console.log(data1)
        var updatenote = (JSON.parse(localStorage.getItem(strbook))).splice(stritem,1)[0]
        var temp = 0
        if($('#noteTitle').val() !== (JSON.parse(localStorage.getItem(strbook)))[Number(stritem)].title){
            //console.log($('#noteTitle').val())
            //console.log((JSON.parse(localStorage.getItem(strbook)))[Number(stritem)].title)
            updatenote["title"] = $('#noteTitle').val()
            temp = 1
        }
        if($('#noteContent').val() !== (JSON.parse(localStorage.getItem(strbook)))[Number(stritem)].note){
            updatenote["note"] = $('#noteContent').val()
            temp = 1
        }
        if(temp === 1){
            //console.log('yes')
            var data = JSON.parse(localStorage.getItem(strbook))
            //console.log(data)
            data.splice(stritem,1,updatenote)
            //console.log(data)
            localStorage.setItem(strbook,JSON.stringify(data))
        }
        date = (JSON.parse(localStorage.getItem(strbook)))[Number(stritem)].time

        $('#editorContent p textarea').text($('#noteContent').val())
        $('#editorTool li:first').html('<a id="editBtn" onclick="newNote(\'' + strbook + '_' + Number(stritem) + '\')"><span class="s-lang">编辑</span></a>')
        $('#editorTool li:last').html('<a id="editDel" onclick="delBtn(\'' + strbook + '_' + Number(stritem) + '\')"><span class="s-lang">删除</span></a>')
        $('#editorTool li:last').show()
        //console.log(JSON.parse(localStorage.getItem(str)).length-1)
        $('.created-time').text(date)
        $('.updated-time').text('')
        $('#mceToolbarContainer').hide()
        $('#infoToolbar').show()
        show_list(strbook)
        if(strbook === 'star') load()
    }
    
}
//加星
function addToStar(){

}
//删除
function delBtn(str){
    console.log(str)
    var strbook = /([a-z]*)_?(\d*)/.exec(str)[1]//study
    var stritem = /([a-z]*)_?(\d*)/.exec(str)[2]//1
    var collection = localStorage.getItem(strbook)//study数
    data = JSON.parse(collection)//解析
    data.splice(stritem,1)[0]//删除
    localStorage.setItem(strbook, JSON.stringify(data))//重新设置localstorage
    show_list(strbook)//显示list
    if($('#noteTitle').val() === (JSON.parse(collection))[Number(stritem)].title && $('#editorContent p').text() == (JSON.parse(collection))[Number(stritem)].note)
        show_item(strbook + '_' + Number(JSON.parse(localStorage.getItem(strbook)).length - 1))
    if(strbook === 'star') load()
}

//获得时间
function getDateString(){
    let date = new Date();
    let date_year = date.getFullYear()
    let date_month = (date.getMonth()+1)<10 ? '0'+ (date.getMonth()+1):(date.getMonth()+1)
    let date_date = date.getDate()<10 ? '0'+ date.getDate():date.getDate()
    let date_hour = date.getHours()<10 ? '0'+ date.getHours():date.getHours()
    let date_min = date.getMinutes()<10 ? '0'+ date.getMinutes():date.getMinutes()
    let date_sec = date.getSeconds()<10 ? '0'+ date.getSeconds():date.getSeconds()
    return date_year + '-' + date_month + '-' + date_date + ' ' + 
            date_hour + ':' + date_min + ':' + date_sec
}

$(document).ready(function(){
    if(window.localStorage.length === 0){
        localStorage.setItem("study",'[]');
        localStorage.setItem("work",'[]');
        localStorage.setItem("default",'[]');
        localStorage.setItem("star",'[]');
    }
    //默认显示
    show_list('default')
    if(localStorage.getItem('default') !== "[]"){
        show_item('default_' + Number(JSON.parse(localStorage.getItem('default')).length - 1))
    }else{
        $('#noteItemList').text('')
        $('#nonote').show()
        $('#noteTop').hide()
        $('#editor').hide()
    }
})

function load(){
    //最左侧加星笔记的html
    var collection = localStorage.getItem("star")
    var notestring = ''
    if(collection !== '[]' &&collection !== null){
        console.log(collection)
        var data=JSON.parse(collection);
        for(var i = data.length - 1; i >= 0; i--){
            notestring += '<li><a id="noteid_' + i + '" onclick="show_item(\'' + 'star_' + i + '\')">' + data[i].title + '</a><span class="delete-star" title="删除" onclick="delBtn(\'star_' + i + '\')">X</span></li>'
        }
    }
    $('#starNotes').html(notestring)
    //
    //
    //
}
window.onload = load;