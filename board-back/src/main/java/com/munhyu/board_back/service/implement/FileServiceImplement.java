package com.munhyu.board_back.service.implement;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.munhyu.board_back.service.FileService;

@Service
public class FileServiceImplement implements FileService {

  @Value("${file.path}")
  private String filePath;
  @Value("${file.url}")
  private String fileUrl;

  @Override
  public String upload(MultipartFile file) {

    if (file.isEmpty())
      return null;

    String originalFileName = file.getOriginalFilename();
    String extension = originalFileName.substring(originalFileName.lastIndexOf("."));
    String uuid = UUID.randomUUID().toString();
    String saveFileName = uuid + extension;
    String savePath = filePath + saveFileName;

    try {

      System.out.println("Uploading file: " + originalFileName);

      file.transferTo(new File(savePath));

    } catch (Exception e) {
      e.printStackTrace();
      return null;
    }
    System.out.println("File uploaded successfully: " + saveFileName);
    return fileUrl + saveFileName;
  }

  @Override
  public Resource getImage(String fileName) {

    Resource resource = null;

    try {
      resource = new UrlResource("file:" + filePath + fileName);
    } catch (Exception e) {
      e.printStackTrace();
    }

    return resource;
  }

  @Override
  public boolean deleteImage(String fileName) {
    try {
      fileName = fileName.substring(fileName.lastIndexOf('/') + 1);
      Path fileToDelete = Paths.get(filePath, fileName);

      if (Files.exists(fileToDelete) && !Files.isDirectory(fileToDelete)) {
        Files.delete(fileToDelete);
        System.out.println("File deleted successfully: " + fileName);
        return true;
      } else {
        System.out.println("File not found or is a directory: " + fileName);
        return false;
      }
    } catch (Exception e) {
      e.printStackTrace();
      return false;
    }
  }
}
