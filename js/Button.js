function Button(){
	this.button_size = width / 7;
	this.next_img = loadImage("./img/icon/next.png");
	this.back_img = loadImage("./img/icon/back.png");
	this.info_img = loadImage("./img/icon/info.png");
}

Button.prototype.display = function() {
	this.display_info();
	this.display_back();
	this.display_next();
}

// Info button
Button.prototype.display_info = function() {
	push();
	tint(255, 200);
	image(this.info_img, width-this.button_size, this.button_size/4, this.button_size, this.button_size);
	pop();
}

// Next button
Button.prototype.display_next = function() {
	push();
	tint(255, 200);
	image(this.next_img, 0, height / 2, this.button_size, this.button_size);
	pop();
}

// Back button
Button.prototype.display_back = function() {
	push();
	tint(255, 200);
	image(this.back_img, width - this.button_size, height / 2, this.button_size, this.button_size);
	pop();
}

Button.prototype.is_next_tapped = function(current_x, current_y) {
	return (current_x > 0 && current_x < this.button_size && current_y > (height / 2) && current_y < (height / 2) + this.button_size);
}


Button.prototype.is_back_tapped = function(current_x, current_y) {
	return (current_x > width - this.button_size && current_x < width && current_y > (height / 2) && current_y < (height / 2) + this.button_size);
}

/*
Button.prototype.display_info = function() {
	push();
	fill(0, 127);
	ellipse(width-this.button_size/1.5, this.button_size/1.5, this.button_size, this.button_size);
	fill(255, 127);
	rectMode(CENTER);
	rect(width-this.button_size/1.5, this.button_size/1.5, this.button_size/5, this.button_size/1.5);
	rect(width-this.button_size/1.5, this.button_size/1.5, this.button_size/1.5, this.button_size/5);
	pop();	
}
*/
/*
// Next button
Button.prototype.display_next = function() {
	push();
	rectMode(CORNER);
	fill(0, 127);
	rect(0, height / 2, this.button_size, this.button_size);
	fill(255, 127);
	triangle(this.button_size/4, height / 2 + this.button_size/2,
	         this.button_size*2/3, height / 2 + this.button_size/4,
	         this.button_size*2/3, height / 2 + this.button_size - this.button_size/4);
	pop();
	
}
*/
/*
// Back button
Button.prototype.display_back = function() {
	push();
	rectMode(CORNER);
	fill(0, 127);
	rect(width - this.button_size, height / 2, this.button_size, this.button_size);
	fill(255, 127);
	triangle(width - (this.button_size/4), height / 2 + this.button_size/2,
	         width - (this.button_size*2/3), height / 2 + this.button_size/4,
	         width - (this.button_size*2/3), height / 2 + this.button_size - this.button_size/4);
	pop();
}
*/