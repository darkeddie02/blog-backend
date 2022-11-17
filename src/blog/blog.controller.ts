import {
  Controller,
  Get,
  Post,
  HttpStatus,
  Param,
  NotFoundException,
  Res,
  Body,
  Patch,
  Query,
  Delete,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreatePostDTO } from './dto/create-post.dto';
import { ValidateObjID } from './shared/pipes/validate-object-id.pipes';

@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  // Submit a post
  @Post('/post')
  async addPost(@Res() Res, @Body() createPostDTO: CreatePostDTO) {
    const newPost = await this.blogService.addPost(createPostDTO);
    return Res.status(HttpStatus.OK).json({
      message: 'Post has been created successfully!',
      post: newPost,
    });
  }

  // Fetch a single post by id
  @Get('post/:postID')
  async getPost(@Res() res, @Param('postID', new ValidateObjID()) postID) {
    const post = await this.blogService.getPost(postID);
    if (!post) {
      throw new NotFoundException('Post does not exist!');
    }

    return res.status(HttpStatus.OK).json(post);
  }

  // Fetch all posts
  @Get('posts')
  async getPosts(@Res() res) {
    const posts = await this.blogService.getPosts();
    return res.status(HttpStatus.OK).json(posts);
  }

  // Update post
  @Patch('edit/:postID')
  async editPosts(
    @Res() res,
    @Query('postID', new ValidateObjID()) postID,
    @Body() createPostDTO: CreatePostDTO,
  ) {
    const editedPost = await this.blogService.editPost(postID, createPostDTO);
    if (!editedPost) {
      throw new NotFoundException('Post does not exist!');
    }

    return res.status(HttpStatus.OK).json({
      message: 'Post has been edited successfully!',
      post: editedPost,
    });
  }

  // Delete Post
  @Delete('/delete')
  async deletePost(@Res() res, @Query('postID', new ValidateObjID()) postID) {
    const deletedPost = await this.blogService.deletePost(postID);
    if (!deletedPost) {
      throw new NotFoundException('Post does not exist!');
    }

    return res.status(HttpStatus.OK).json({
      message: 'Post has been deleted successfully!',
      post: deletedPost,
    });
  }
}
