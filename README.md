# Better Bible App

A modern, AI-powered Bible learning application that creates age-appropriate content and custom images for any Bible verse.

## Features

- **Editable Bible Verse Input**: Type any Bible verse reference (e.g., "John 3:16", "Psalm 23:1")
- **Age-Appropriate Content**: Four age groups (0-6, 7-12, 13-17, Adult) with tailored content
- **AI-Generated Content**: Uses Google Gemini AI to create personalized explanations, stories, prayers, and activities
- **Custom AI Images**: Generates unique images using Runway AI for each verse and age group combination
- **Smart Caching**: Saves generated content to avoid regenerating the same material
- **Random Image Selection**: Displays random images from age-specific folders
- **Responsive Design**: Beautiful, modern interface that works on all devices

## Setup

### 1. Install Dependencies

```bash
npm install
npm install @google/generative-ai
```

### 2. Environment Variables

Create a `.env.local` file in your project root with your API keys:

```env
# Google Gemini AI API Key
GEMINI_API_KEY=AIzaSyBX4Q3dZXzdHIoHDSHX6i5Qhp8jS01wUds

# Runway AI API Key
RUNWAY_API_KEY=Bpu5CScHECsobs0n7gJwnGLacwWOnHZv

# Runway AI Configuration
RUNWAY_MODEL=runware:101@1
RUNWAY_API_URL=https://api.runwayml.com/v1/inference
```

### 3. Image Folders

The app expects the following folder structure for random images:

```
public/
  images/
    0-6/          # Images for 0-6 year olds
    7-12/         # Images for 7-12 year olds
    13-17/        # Images for 13-17 year olds
    adult/         # Images for adults
```

Each folder should contain image files (JPG, PNG, GIF, WebP, SVG) that will be randomly selected and displayed.

### 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Railway Deployment

For production deployment, we recommend using **Railway** - a modern platform that provides:

- **Automatic deployments** from your GitHub repository
- **Built-in environment variable management**
- **Database services** (PostgreSQL, MongoDB, Redis)
- **Auto-scaling** and **health monitoring**
- **Custom domains** and **SSL certificates**

### Quick Deploy to Railway

1. **Connect your repository** to Railway
2. **Set environment variables** in Railway dashboard
3. **Add database service** (optional but recommended)
4. **Deploy automatically** on every push

📖 **See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for detailed deployment instructions.**

## How It Works

### Content Generation Flow

1. **User Input**: User types a Bible verse reference in the center input field
2. **Age Selection**: User clicks on an age group card
3. **AI Processing**: The app simultaneously:
   - Generates age-appropriate content using Gemini AI
   - Creates a custom image using Runway AI
4. **Caching**: Generated content is saved for future use
5. **Display**: Shows both the AI-generated content and custom image

### AI Prompts

#### Gemini AI (Content)
- Creates age-appropriate explanations, stories, prayers, and activities
- Tailors language complexity and themes to each age group
- Ensures biblical accuracy and family-friendly content

#### Runway AI (Images)
- Generates unique, inspiring images for each verse
- Applies age-appropriate visual styles
- Ensures family-friendly, biblically appropriate imagery

### Caching System

- **In-Memory Cache**: Currently uses a simple Map for caching
- **Cache Key**: `verse_agegroup` (e.g., "john 3:16_7-12")
- **Benefits**: 
  - Faster response times for repeated requests
  - Reduced API costs
  - Consistent content for the same verse/age combinations

## API Endpoints

### `/api/generate-content`
- **Method**: POST
- **Body**: `{ verse: string, ageGroup: string }`
- **Response**: Age-appropriate Bible content with caching

### `/api/generate-image`
- **Method**: POST
- **Body**: `{ verse: string, ageGroup: string }`
- **Response**: Custom AI-generated image

### `/api/random-image`
- **Method**: GET
- **Query**: `?folder=agegroup`
- **Response**: Random image from specified age group folder

### `/api/placeholder-image`
- **Method**: GET
- **Response**: Fallback SVG placeholder image

## Customization

### Adding New Age Groups

1. Update the `Age` type in `app/page.tsx`
2. Add new age group data to the `ageGroups` state
3. Create corresponding image folder in `public/images/`
4. Update AI prompts in both API endpoints

### Modifying AI Prompts

- **Content Prompts**: Edit `createPrompt()` function in `/api/generate-content/route.ts`
- **Image Prompts**: Edit `createImagePrompt()` function in `/api/generate-image/route.ts`

### Styling

The app uses custom CSS classes defined in `app/globals.css`. Modify these to change the visual appearance.

## Production Considerations

### Database Integration
- Replace in-memory cache with Redis or database
- Store generated content persistently
- Add user accounts and content history

### API Rate Limiting
- Implement rate limiting for AI generation endpoints
- Add request throttling per user/IP

### Error Handling
- Add comprehensive error logging
- Implement retry mechanisms for failed API calls
- Add fallback content for AI failures

### Security
- Move API keys to secure environment variables
- Implement user authentication
- Add content moderation for AI-generated content

## Troubleshooting

### Common Issues

1. **API Key Errors**: Check your `.env.local` file and ensure keys are correct
2. **Image Generation Fails**: Verify Runway AI API key and model name
3. **Content Generation Fails**: Check Gemini AI API key and quota
4. **Images Not Loading**: Ensure image folders exist and contain valid image files

### Debug Mode

Check browser console and server logs for detailed error information.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please check the troubleshooting section or create an issue in the repository.
