$(document).ready(function(){
	$(".embed-code").click(function(){
		$(this).hide();

		$(".fechar").show(200);
		$("#embed-code").show(200);
	});

	$(".fechar").click(function(){
		$(this).hide();

		$("#embed-code").hide();
		$(".embed-code").show(200);
	});
})