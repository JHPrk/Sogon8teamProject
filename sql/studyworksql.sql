-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`USER`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`USER` (
  `ID` INT NOT NULL,
  `Password` VARCHAR(45) NOT NULL,
  `Name` VARCHAR(25) NOT NULL,
  `Sex` VARCHAR(15) NOT NULL,
  `Major` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`ID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`STUDENT`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`STUDENT` (
  `USER_ID` INT NOT NULL,
  `Grade` INT NOT NULL,
  PRIMARY KEY (`USER_ID`),
  CONSTRAINT `fk_STUDENT_USER`
    FOREIGN KEY (`USER_ID`)
    REFERENCES `mydb`.`USER` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`PROFESSOR`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`PROFESSOR` (
  `USER_ID` INT NOT NULL,
  PRIMARY KEY (`USER_ID`),
  CONSTRAINT `fk_PROFESSOR_USER1`
    FOREIGN KEY (`USER_ID`)
    REFERENCES `mydb`.`USER` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`CLASSROOM`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`CLASSROOM` (
  `CID` INT NOT NULL,
  `ClassName` VARCHAR(30) NOT NULL,
  `PROFESSOR_USER_ID` INT NOT NULL,
  PRIMARY KEY (`CID`),
  INDEX `fk_CLASSROOM_PROFESSOR1_idx` (`PROFESSOR_USER_ID` ASC) VISIBLE,
  CONSTRAINT `fk_CLASSROOM_PROFESSOR1`
    FOREIGN KEY (`PROFESSOR_USER_ID`)
    REFERENCES `mydb`.`PROFESSOR` (`USER_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`STUDENT_CLASSROOM`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`STUDENT_CLASSROOM` (
  `STUDENT_USER_ID` INT NOT NULL,
  `CLASSROOM_CID` INT NOT NULL,
  PRIMARY KEY (`STUDENT_USER_ID`, `CLASSROOM_CID`),
  INDEX `fk_STUDENT_CLASSROOM_CLASSROOM1_idx` (`CLASSROOM_CID` ASC) VISIBLE,
  CONSTRAINT `fk_STUDENT_CLASSROOM_STUDENT1`
    FOREIGN KEY (`STUDENT_USER_ID`)
    REFERENCES `mydb`.`STUDENT` (`USER_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_STUDENT_CLASSROOM_CLASSROOM1`
    FOREIGN KEY (`CLASSROOM_CID`)
    REFERENCES `mydb`.`CLASSROOM` (`CID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`ASSIGNMENT`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`ASSIGNMENT` (
  `CLASSROOM_CID` INT NOT NULL,
  `AssignmentNo` INT NOT NULL,
  `Name` VARCHAR(25) NOT NULL,
  `DueDate` DATE NOT NULL,
  `StartDate` DATE NOT NULL,
  `Discription` VARCHAR(45) NULL,
  `Score` INT NULL,
  PRIMARY KEY (`CLASSROOM_CID`, `AssignmentNo`),
  INDEX `fk_ASSIGNMENT_CLASSROOM1_idx` (`CLASSROOM_CID` ASC) VISIBLE,
  CONSTRAINT `fk_ASSIGNMENT_CLASSROOM1`
    FOREIGN KEY (`CLASSROOM_CID`)
    REFERENCES `mydb`.`CLASSROOM` (`CID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`LECTURE`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`LECTURE` (
  `CLASSROOM_CID` INT NOT NULL,
  `LectureNo` INT NOT NULL,
  `LectureTime` DATETIME NOT NULL,
  PRIMARY KEY (`CLASSROOM_CID`, `LectureNo`),
  INDEX `fk_LECTURE_CLASSROOM1_idx` (`CLASSROOM_CID` ASC) VISIBLE,
  CONSTRAINT `fk_LECTURE_CLASSROOM1`
    FOREIGN KEY (`CLASSROOM_CID`)
    REFERENCES `mydb`.`CLASSROOM` (`CID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`ATTANDANCE`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`ATTANDANCE` (
  `STUDENT_USER_ID` INT NOT NULL,
  `CLASSROOM_CID` INT NOT NULL,
  `LectureNo` INT NOT NULL,
  `AttandanceType` VARCHAR(25) NOT NULL,
  PRIMARY KEY (`STUDENT_USER_ID`, `CLASSROOM_CID`, `LectureNo`),
  INDEX `fk_ATTANDANCE_LECTURE1_idx` (`CLASSROOM_CID` ASC, `LectureNo` ASC) VISIBLE,
  CONSTRAINT `fk_ATTANDANCE_STUDENT1`
    FOREIGN KEY (`STUDENT_USER_ID`)
    REFERENCES `mydb`.`STUDENT` (`USER_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ATTANDANCE_LECTURE1`
    FOREIGN KEY (`CLASSROOM_CID` , `LectureNo`)
    REFERENCES `mydb`.`LECTURE` (`CLASSROOM_CID` , `LectureNo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`UPLOADED_ASSIGNMENT`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`UPLOADED_ASSIGNMENT` (
  `STUDENT_USER_ID` INT NOT NULL,
  `CLASSROOM_CID` INT NOT NULL,
  `AssignmentNo` INT NOT NULL,
  `UploadDate` DATETIME NOT NULL,
  `Content` VARCHAR(65) NULL,
  PRIMARY KEY (`STUDENT_USER_ID`, `CLASSROOM_CID`, `AssignmentNo`),
  INDEX `fk_UPLOADED_ASSIGNMENT_ASSIGNMENT1_idx` (`CLASSROOM_CID` ASC, `AssignmentNo` ASC) VISIBLE,
  CONSTRAINT `fk_UPLOADED_ASSIGNMENT_STUDENT1`
    FOREIGN KEY (`STUDENT_USER_ID`)
    REFERENCES `mydb`.`STUDENT` (`USER_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_UPLOADED_ASSIGNMENT_ASSIGNMENT1`
    FOREIGN KEY (`CLASSROOM_CID` , `AssignmentNo`)
    REFERENCES `mydb`.`ASSIGNMENT` (`CLASSROOM_CID` , `AssignmentNo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`GRADE_REPORT`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`GRADE_REPORT` (
  `STUDENT_USER_ID` INT NOT NULL,
  `CLASSROOM_CID` INT NOT NULL,
  `TotalScore` INT NOT NULL,
  PRIMARY KEY (`STUDENT_USER_ID`, `CLASSROOM_CID`),
  CONSTRAINT `fk_GRADE_REPORT_STUDENT_CLASSROOM1`
    FOREIGN KEY (`STUDENT_USER_ID` , `CLASSROOM_CID`)
    REFERENCES `mydb`.`STUDENT_CLASSROOM` (`STUDENT_USER_ID` , `CLASSROOM_CID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`FILE`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`FILE` (
  `STUDENT_USER_ID` INT NOT NULL,
  `CLASSROOM_CID` INT NOT NULL,
  `AssignmentNo` INT NOT NULL,
  `FileID` INT NOT NULL,
  `OrigFileName` VARCHAR(45) NOT NULL,
  `FileName` VARCHAR(45) NOT NULL,
  `FilePath` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`STUDENT_USER_ID`, `CLASSROOM_CID`, `AssignmentNo`, `FileID`),
  INDEX `fk_FILE_UPLOADED_ASSIGNMENT1_idx` (`STUDENT_USER_ID` ASC, `CLASSROOM_CID` ASC, `AssignmentNo` ASC) VISIBLE,
  CONSTRAINT `fk_FILE_UPLOADED_ASSIGNMENT1`
    FOREIGN KEY (`STUDENT_USER_ID` , `CLASSROOM_CID` , `AssignmentNo`)
    REFERENCES `mydb`.`UPLOADED_ASSIGNMENT` (`STUDENT_USER_ID` , `CLASSROOM_CID` , `AssignmentNo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`SESSION`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`SESSION` (
  `USER_ID` INT NOT NULL,
  `SessionID` INT NOT NULL,
  `LastAccessDate` DATETIME NOT NULL,
  PRIMARY KEY (`USER_ID`, `SessionID`),
  INDEX `fk_SESSION_USER1_idx` (`USER_ID` ASC) VISIBLE,
  CONSTRAINT `fk_SESSION_USER1`
    FOREIGN KEY (`USER_ID`)
    REFERENCES `mydb`.`USER` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
