$(document).ready(function(){
	init_word_box();
	$("#info").ajaxStart(function(){
		 $(this).html(LANG['AJAX_RUNNING']);
		 $(this).show();
	});
	$("#info").ajaxStop(function(){
		
		$("#info").oneTime(2000, function() {				    
			$(this).fadeOut(2,function(){
				$("#info").html("");				
			});			    	
		});	
	});
	$("form").bind("submit",function(){
		var doms = $(".require");
		var check_ok = true;
		$.each(doms,function(i, dom){
			if($.trim($(dom).val())==''||($(dom).val()=='0'&& $(dom).is("select")))
			{						
					var title = $(dom).parent().parent().find(".item_title").html();
					if(!title)
					{
						title = '';
					}
					if(title.substr(title.length-1,title.length)==':')
					{
						title = title.substr(0,title.length-1);
					}
					if($(dom).val()=='')
					TIP = LANG['PLEASE_FILL'];
					if($(dom).val()=='0')
					TIP = LANG['PLEASE_SELECT'];						
					alert(TIP+title);
					$(dom).focus();
					check_ok = false;
					return false;						
			}
		});
		if(!check_ok)
		return false;
	});
	
	var K = KindEditor;
    var editor = K.create('textarea.ketext', {
        allowFileManager : true,
        emoticonsPath:EMOT_URL,
        afterBlur: function(){this.sync();}, //兼容jq的提交，失去焦点时同步表单值
        height:300,
        items : [
			'source','fsource', 'fullscreen', 'undo', 'redo', 'print', 'cut', 'copy', 'paste',
			'plainpaste', 'wordpaste', 'justifyleft', 'justifycenter', 'justifyright',
			'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
			'superscript', 'selectall','/',
			'title', 'fontname', 'fontsize', 'forecolor', 'hilitecolor', 'bold',
			'italic', 'underline', 'strikethrough', 'removeformat', 'image','multiimage',
			'flash', 'media', 'table', 'hr', 'emoticons', 'link', 'unlink'
		]
    });   
	
	var ieditor = K.editor({
       allowFileManager : true,
       imageSizeLimit:MAX_FILE_SIZE               
    });
	K('.keimg').unbind("click");
    K('.keimg').click(function() {
        var node = K(this);
        var dom =$(node).parent().parent().parent().parent();
        ieditor.loadPlugin('image', function() {
               ieditor.plugin.imageDialog({
               // imageUrl : K("#keimg_h_"+$(this).attr("rel")).val(),
                imageUrl:dom.find("#keimg_h_"+node.attr("rel")).val(),
                clickFn : function(url, title, width, height, border, align) {       
                    dom.find("#keimg_a_"+node.attr("rel")).attr("href",url),
                    dom.find("#keimg_m_"+node.attr("rel")).attr("src",url),
                    dom.find("#keimg_h_"+node.attr("rel")).val(url),
					dom.find(".keimg_d[rel='"+node.attr("rel")+"']").show(),
                    ieditor.hideDialog();
                }
            });
        });
    });
	
	/**
	 * 删除单图
	 */
    K('.keimg_d').click(function() {
        var node = K(this);
		K(this).hide();
        var dom =$(node).parent().parent().parent().parent();
        dom.find("#keimg_a_"+node.attr("rel")).attr("href","");
        dom.find("#keimg_m_"+node.attr("rel")).attr("src",ROOT_PATH + "/admin/Tpl/default/Common/images/no_pic.gif");
        dom.find("#keimg_h_"+node.attr("rel")).val("");
    });
	
});
//排序
function sortBy(field,sortType,module_name,action_name)
{
	location.href = CURRENT_URL+"&_sort="+sortType+"&_order="+field+"&";
}
//添加跳转
function add()
{
	location.href = ROOT+"?"+VAR_MODULE+"="+MODULE_NAME+"&"+VAR_ACTION+"=add";
}
//编辑跳转
function edit(id)
{
	location.href = ROOT+"?"+VAR_MODULE+"="+MODULE_NAME+"&"+VAR_ACTION+"=edit&id="+id;
}
//添加跳转
function add_goods()
{
	location.href = ROOT+"?"+VAR_MODULE+"="+MODULE_NAME+"&"+VAR_ACTION+"=shop_add";
}
//编辑跳转
function edit_goods(id)
{
	location.href = ROOT+"?"+VAR_MODULE+"="+MODULE_NAME+"&"+VAR_ACTION+"=shop_edit&id="+id;
}

//添加跳转
function add_deal_youhui()
{
	location.href = ROOT+"?"+VAR_MODULE+"="+MODULE_NAME+"&"+VAR_ACTION+"=youhui_add";
}
//编辑跳转
function edit_deal_youhui(id)
{
	location.href = ROOT+"?"+VAR_MODULE+"="+MODULE_NAME+"&"+VAR_ACTION+"=youhui_edit&id="+id;
}

//全选
function CheckAll(tableID)
{
	$("#"+tableID).find(".key").attr("checked",$("#check").attr("checked"));
}

function toogle_status(id,domobj,field)
{
	$.ajax({ 
		url: ROOT+"?"+VAR_MODULE+"="+MODULE_NAME+"&"+VAR_ACTION+"=toogle_status&field="+field+"&id="+id, 
		data: "ajax=1",
		dataType: "json",
		success: function(obj){

			if(obj.data=='1')
			{
				$(domobj).html(LANG['YES']);
			}
			else if(obj.data=='0')
			{
				$(domobj).html(LANG['NO']);
			}
			else if(obj.data=='')
			{
				
			}
			$("#info").html(obj.info);
		}
	});
}

//改变状态
function set_effect(id,domobj)
{
		$.ajax({ 
				url: ROOT+"?"+VAR_MODULE+"="+MODULE_NAME+"&"+VAR_ACTION+"=set_effect&id="+id, 
				data: "ajax=1",
				dataType: "json",
				success: function(obj){

					if(obj.data=='1')
					{
						$(domobj).html(LANG['IS_EFFECT_1']);
					}
					else if(obj.data=='0')
					{
						$(domobj).html(LANG['IS_EFFECT_0']);
					}
					else if(obj.data=='')
					{
						
					}
					$("#info").html(obj.info);
				}
		});
}

function set_sort(id,sort,domobj)
{
	$(domobj).html("<input type='text' value='"+sort+"' id='set_sort' class='require'  />");
	$("#set_sort").select();
	$("#set_sort").focus();
	$("#set_sort").bind("blur",function(){
		var newsort = $(this).val();
		$.ajax({ 
			url: ROOT+"?"+VAR_MODULE+"="+MODULE_NAME+"&"+VAR_ACTION+"=set_sort&id="+id+"&sort="+newsort, 
			data: "ajax=1",
			dataType: "json",
			success: function(obj){
				if(obj.status)
				{
					$(domobj).html(newsort);
				}
				else
				{
					$(domobj).html(sort);
				}
				$("#info").html(obj.info);

			}
	});
});
}

//普通删除
function del(id)
{
	if(!id)
	{
		idBox = $(".key:checked");
		if(idBox.length == 0)
		{
			alert(LANG['DELETE_EMPTY_WARNING']);
			return;
		}
		idArray = new Array();
		$.each( idBox, function(i, n){
			idArray.push($(n).val());
		});
		id = idArray.join(",");
	}
	if(confirm(LANG['CONFIRM_DELETE']))
	$.ajax({ 
			url: ROOT+"?"+VAR_MODULE+"="+MODULE_NAME+"&"+VAR_ACTION+"=delete&id="+id, 
			data: "ajax=1",
			dataType: "json",
			success: function(obj){
				$("#info").html(obj.info);
				if(obj.status==1)
				location.href=location.href;
			}
	});
}
//完全删除
function foreverdel(id)
{
	if(!id)
	{
		idBox = $(".key:checked");
		if(idBox.length == 0)
		{
			alert(LANG['DELETE_EMPTY_WARNING']);
			return;
		}
		idArray = new Array();
		$.each( idBox, function(i, n){
			idArray.push($(n).val());
		});
		id = idArray.join(",");
	}
	if(confirm(LANG['CONFIRM_DELETE']))
	$.ajax({ 
			url: ROOT+"?"+VAR_MODULE+"="+MODULE_NAME+"&"+VAR_ACTION+"=foreverdelete&id="+id, 
			data: "ajax=1",
			dataType: "json",
			success: function(obj){
				$("#info").html(obj.info);
				if(obj.status==1)
				location.href=location.href;
			}
	});
}
//恢复
function restore(id)
{
	if(!id)
	{
		idBox = $(".key:checked");
		if(idBox.length == 0)
		{
			alert(LANG['RESTORE_EMPTY_WARNING']);
			return;
		}
		idArray = new Array();
		$.each( idBox, function(i, n){
			idArray.push($(n).val());
		});
		id = idArray.join(",");
	}
	if(confirm(LANG['CONFIRM_RESTORE']))
	$.ajax({ 
			url: ROOT+"?"+VAR_MODULE+"="+MODULE_NAME+"&"+VAR_ACTION+"=restore&id="+id, 
			data: "ajax=1",
			dataType: "json",
			success: function(obj){
				$("#info").html(obj.info);
				if(obj.status==1)
				location.href = location.href;
			}
	});
}

//节点全选
function check_node(obj)
{
	$(obj.parentNode.parentNode.parentNode).find(".node_item").attr("checked",$(obj).attr("checked"));
}
function check_is_all(obj)
{
	if($(obj.parentNode.parentNode.parentNode).find(".node_item:checked").length!=$(obj.parentNode.parentNode.parentNode).find(".node_item").length)
	{
		$(obj.parentNode.parentNode.parentNode).find(".check_all").attr("checked",false);
	}
	else
		$(obj.parentNode.parentNode.parentNode).find(".check_all").attr("checked",true);
}
function check_module(obj)
{
	if($(obj).attr("checked"))
	{
		$(obj).parent().parent().find(".check_all").attr("disabled",true);
		$(obj).parent().parent().find(".node_item").attr("disabled",true);
	}
	else
	{
		$(obj).parent().parent().find(".check_all").attr("disabled",false);
		$(obj).parent().parent().find(".node_item").attr("disabled",false);	
	}
}


function export_csv()
{
	var inputs = $(".search_row").find("input");
	var selects = $(".search_row").find("select");
	var param = '';
	for(i=0;i<inputs.length;i++)
	{
		if(inputs[i].name!='m'&&inputs[i].name!='a')
		param += "&"+inputs[i].name+"="+$(inputs[i]).val();
	}
	for(i=0;i<selects.length;i++)
	{
		param += "&"+selects[i].name+"="+$(selects[i]).val();
	}
	var url= ROOT+"?"+VAR_MODULE+"="+MODULE_NAME+"&"+VAR_ACTION+"=export_csv";
	location.href = url+param;
}

function init_word_box()
{
	$(".word-only").bind("keydown",function(e){
		if(e.keyCode<65||e.keyCode>90)
		{
			if(e.keyCode != 8)
			return false;
		}
	});
}

function reset_sending(field)
{
	$.ajax({ 
		url: ROOT+"?"+VAR_MODULE+"=Index&"+VAR_ACTION+"=reset_sending&field="+field, 
		data: "ajax=1",
		dataType: "json",
		success: function(obj){
			$("#info").html(obj.info);			
		}
	});
}

function search_supplier()
{
	var key = $("input[name='supplier_key']").val();
	if($.trim(key)=='')
	{
		alert(INPUT_KEY_PLEASE);
	}
	else
	{
		$.ajax({ 
			url: ROOT+"?"+VAR_MODULE+"=SupplierLocation&"+VAR_ACTION+"=search_supplier", 
			data: "ajax=1&key="+key,
			type: "POST",
			success: function(obj){
				$("#supplier_list").html(obj);
			}
		});
	}
}
userCard=(function(){	
	return {
		load : function(e,id){
	
				
			}
	  	};
})();

function checkidcrad(card){
	$.ajax({
		url:ROOT+"?m=Public&a=checkIdCard&card="+card,
		dataType:"json",
		success:function(result){
			if(result.status == 0){
				alert(result.info);
			}
			else{
				var alt = "身份证号："+result.cardNO+"\n";
				alt += "籍贯："+result.address+"\n";
				alt +="生日："+result.birthday+"\n";
				alt += "性别："+result.sex+"\n\n";
				alt += "查询结果仅供参考";
				alert(alt);
			}
		},
		error:function(){
			alert("网络不通，或者当前接口查询次数已满，请等待下个小时！");
		}
	});
}

function do_credit(id){
		$.weeboxs.open(ROOT+'?m=Credit&a=op_passed&id='+id, {contentType:'ajax',showButton:false,title:LANG['USER_PASSED'],width:700,height:500});
	}
	