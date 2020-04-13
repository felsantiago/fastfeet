import HttpStatus from 'http-status-codes';

function BadRequestException(message) {
  this.erro = true;
  this.timestamp = new Date();
  this.code = HttpStatus.BAD_REQUEST;
  this.status = HttpStatus.getStatusText(HttpStatus.BAD_REQUEST);
  this.message = message;
}

export default BadRequestException;
