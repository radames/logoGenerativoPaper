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
	
	$("#vertical-gerado").click(function(){
		$("#fs-type-save option[value*='fs-entertainment']").hide();		
		$("#fs-type-save option[value*='fs-learning']").hide();		
		$("#fs-type-save option[value*='fs-security']").hide();			
		$("#fs-type-save option[value*='fs-assistance']").hide();			
		$("#fs-type-save option[value*='fs-insurance']").hide();
	});
								
	$("#horizontal-gerado").click(function(){
		$("#fs-type-save option[value*='fs-entertainment']").show();
		$("#fs-type-save option[value*='fs-learning']").show();
		$("#fs-type-save option[value*='fs-security']").show();
		$("#fs-type-save option[value*='fs-assistance']").show();
		$("#fs-type-save option[value*='fs-insurance']").show();

	});
});