$(document).ready(function(){
		// GLOBAL VARIABLES 
			var element = "";
			var k = 1;
			var x = "X";
			var o = "O";
			var gameMatrix = [[0,0,0],[0,0,0],[0,0,0]];
			//console.log(gameMatrix);
		// ----------------------------------------------------------------------
		
		// GENERATE THE ROWS AND CELLS IN TABLE
			for(var i = 0; i<3; i++){
				element += "<tr>";
				for(var j=0; j<3; j++){
					element += "<td class='cell' id='" + i +"+"+ j + "' data-row = '" + i +"' data-col='" + j + "'></td>"
					k ++;
				}
				element += "</tr>"
			}
			$(".gameBoard").html(element);
		//-----------------------------------------------------------------------

		// CODE TO MAKE USER'S TURN

			$('td').click(function(){
				var v = $(this).html();
				if(v == ""){
					$(this).html(x);
					r = $(this)[0].attributes[2].nodeValue;
					c = $(this)[0].attributes[3].nodeValue;
					id = $(this)[0].attributes[1].nodeValue;
					gameMatrix[r][c] = 3;
					check_victory();
					setTimeout(computer_turn(r,c,id),1000);				
				}
			});
		//-----------------------------------------------------------------------
		// METHOD TO PERFORM COMPUTER'S TURN
			function computer_turn(r,c,id){
				var result = check_computer_victory();
				if(!result)
					result = check_user_victory(r,c,id);
				if(!result)
					find_place("rand",r);
				check_victory();				
			}

			function check_user_victory(r,c,id){
				var result;
				if(id=='0+0' || id=='0+2' || id=='2+0' || id=='2+2'){
					result = check_row(r,6);
					if(!result)
						result = check_column(c,6);
					if(!result){
						if(r==c)
							result = check_equal_diagonal(6);
						else
							result = check_invert_diagonal(6);
					}
					
				}
				else if(id=='0+1' || id=='1+0' || id=='1+2' || id=='2+1'){
					result = check_row(r,6);
					if(!result)
						result = check_column(c,6);					
				}
				if(id=='1+1'){
					result = check_row(r,6);
					if(!result)
						result = check_column(c,6);
					if(!result)
						result = check_equal_diagonal(6);
					if(!result)
						result = check_invert_diagonal(6);
					
					
				}
				return result;
			}

			function check_computer_victory(){
				//console.log("check computer")
				var result = false;
				for(var i=0; i<3; i++){
					result = check_row(i,10);
					if(result)
						return result;
				}
				for(var i=0; i<3; i++){
					result = check_column(i,10);
					if(result)
						return result;
				}
				result = check_equal_diagonal(10);
				if(!result)
					result = check_invert_diagonal(10);
				return result;
			}
		//------------------------------------------------------------------------
			function check_row_sum(i){
				return gameMatrix[i][0]+gameMatrix[i][1]+gameMatrix[i][2];
			}
			function check_col_sum(j){
				return gameMatrix[0][j]+gameMatrix[1][j]+gameMatrix[2][j];
			}
			function check_equal_diagonal_sum(){
				return gameMatrix[0][0]+gameMatrix[1][1]+gameMatrix[2][2];
			}
			function check_invert_diagonal_sum(){
				return gameMatrix[0][2]+gameMatrix[1][1]+gameMatrix[2][0];
			}

		// METHODS TO CHECK IF THERE'S ANY ROW OR COLUMN OR DIAGONAL WHERE 2 CROSS IS ALREADY PLACED 
			function check_row(i,s){
				var sum = check_row_sum(i);
				if(sum == s){
					find_place("row",i);
					return true;
				}
				return false;
			}

			function check_column(j,s){
				var sum = check_col_sum(j);
				if(sum == s){
					find_place("col",j);
					return true;
				}
				return false;
			}

			function check_equal_diagonal(s){
				var sum = check_equal_diagonal_sum();
				if(sum == s){
					find_place("equi_diag",i);
					return true;
				}
				return false;
			}

			function check_invert_diagonal(s){
				var sum = check_invert_diagonal_sum();
				if(sum == s){
					find_place("diag",i);
					return true;
				}
				return false;
			}
		//--------------------------------------------------------------------------
		

		function find_place(str,i){
			if(str=="row"){
				for(var j=0;j<3;j++){
					if(gameMatrix[i][j] == 0){
						var id = i + "+" + j;
						element = document.getElementById(id);
						element.innerHTML=o;
						gameMatrix[i][j] = 5;
						//console.log("row")
						break;
					}
				}
			}
			else if(str=="col"){
				for(var j=0;j<3;j++){
					if(gameMatrix[j][i] == 0){
						var id = j + "+" + i;
						element = document.getElementById(id);
						element.innerHTML=o;
						gameMatrix[j][i] = 5;
						//console.log("col")
						break;
					}
				}
			}
			else if(str=="equi_diag"){
				for(var j=0;j<3;j++){
					if(gameMatrix[j][j] == 0){
						var id = j + "+" + j;
						element = document.getElementById(id);
						element.innerHTML=o;
						gameMatrix[j][j] = 5;
						//console.log("ed")
						break;
					}
				}
			}
			else if(str=="diag"){
				if(gameMatrix[0][2] == 0){
					element = document.getElementById('0+2');
					gameMatrix[0][2] = 5;
				}
				else if(gameMatrix[1][1] == 0){
					element = document.getElementById('1+1');
					gameMatrix[1][1] = 5;
				}
				else{
					element = document.getElementById('2+0');
					gameMatrix[2][0] = 5;
				}
				element.innerHTML = o;
				//console.log("d")
			}
			else{
				//var id = i + "+" + j;
				var temp = 0;
				for(var i = 0;i<3;i++){
					for(var j=0; j<3; j++){
						if(gameMatrix[i][j] == 0){
						var id = i + "+" + j;
						element = document.getElementById(id);
						element.innerHTML=o;
						gameMatrix[i][j] = 5;
						temp = 1;
						break;
						}
					}
					if(temp == 1)
						break;
				}
				//console.log("rand")
			}
		}

		function check_victory(){
			//for rows
			var sum;
			for(var i=0;i<3;i++){
				sum = check_row_sum(i);
				if(sum == 9 || sum == 15)
					declare_victory(sum,i,"row")
			}
			for(var i=0;i<3;i++){
				sum = check_col_sum(i);
				//console.log(sum);
				if(sum == 9 || sum == 15)
					declare_victory(sum,i,"col")
			}
			sum = check_equal_diagonal_sum();
			if(sum == 9 || sum == 15)
					declare_victory(sum,0,"equi_diag")
			sum = check_invert_diagonal_sum();
			if(sum == 9 || sum == 15)
					declare_victory(sum,i,"diag")
			
		}
		function declare_victory(sum,i,type){
			if(type == "row"){
				for(var j=0;j<3;j++)
					document.getElementById(i+'+'+j).style.backgroundColor="grey";
			}
			else if(type == "col"){
				//console.log("entered");
				for(var j=0;j<3;j++)
					document.getElementById(j+'+'+i).style.backgroundColor="grey";
			}
			else if(type == "equi_diag"){
				for(var j=0;j<3;j++)
					document.getElementById(j+'+'+j).style.backgroundColor="grey";
			}
			else if(type == "diag"){
				document.getElementById('0+2').style.backgroundColor="grey";
				document.getElementById('2+0').style.backgroundColor="grey";
				document.getElementById('1+1').style.backgroundColor="grey";
			}
			if(sum == 9)
				document.getElementById('result').innerHTML="You Won";
			else
				document.getElementById('result').innerHTML="Computer Won";
		}
});