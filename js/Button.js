function Button(){
	this.button_size = width / 7;
}

Button.prototype.display = function() {
	push();
	rectMode(CORNER);
	// Back button
	fill(0, 127);
	rect(0, height / 2, this.button_size, this.button_size);
	fill(255, 127);
	triangle(this.button_size/4, height / 2 + this.button_size/2,
	         this.button_size*2/3, height / 2 + this.button_size/4,
	         this.button_size*2/3, height / 2 + this.button_size - this.button_size/4);
	// Next button
	fill(0, 127);
	rect(width - this.button_size, height / 2, this.button_size, this.button_size);
	fill(255, 127);
	triangle(width - (this.button_size/4), height / 2 + this.button_size/2,
	         width - (this.button_size*2/3), height / 2 + this.button_size/4,
	         width - (this.button_size*2/3), height / 2 + this.button_size - this.button_size/4);
	pop();
}

Button.prototype.is_left_tapped = function(current_x, current_y) {
	return (current_x > 0 && current_x < this.button_size && current_y > (height / 2) && current_y < (height / 2) + this.button_size);
}

Button.prototype.is_right_tapped = function(current_x, current_y) {
	return (current_x > width - this.button_size && current_x < width && current_y > (height / 2) && current_y < (height / 2) + this.button_size);
}