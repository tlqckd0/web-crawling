CREATE TABLE `crawler`.`user` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `nickname` VARCHAR(45) NOT NULL,
  `register` TIMESTAMP NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `nickname_UNIQUE` (`nickname` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


CREATE TABLE `crawler`.`post` (
  `post_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `write_time` TIME NULL,
  PRIMARY KEY (`post_id`),
  INDEX `post_writer_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `post_writer`
    FOREIGN KEY (`user_id`)
    REFERENCES `crawler`.`user` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;