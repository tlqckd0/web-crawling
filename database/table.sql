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
  `post_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL,
  `post_code` VARCHAR(45) NOT NULL,
  `time` TIME NULL,
  PRIMARY KEY (`post_id`),
  INDEX `post_writer_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `post_writer`
    FOREIGN KEY (`user_id`)
    REFERENCES `crawler`.`user` (`user_id`)
    ON DELETE SET NULL
    ON UPDATE SET NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;

CREATE TABLE `crawler`.`comment` (
  `comment_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL,
  `post_id` INT NULL,
  `comment_code` VARCHAR(45) NOT NULL,
  `time` TIME NULL,
  `reple` INT NULL,
  PRIMARY KEY (`comment_id`),
  INDEX `comment_writer_idx` (`user_id` ASC) VISIBLE,
  INDEX `post_comment_idx` (`post_id` ASC) VISIBLE,
  CONSTRAINT `comment_writer`
    FOREIGN KEY (`user_id`)
    REFERENCES `crawler`.`user` (`user_id`)
    ON DELETE SET NULL
    ON UPDATE SET NULL,
  CONSTRAINT `post_comment`
    FOREIGN KEY (`post_id`)
    REFERENCES `crawler`.`post` (`post_id`)
    ON DELETE SET NULL
    ON UPDATE SET NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;
