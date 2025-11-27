import { Box, Button, IconButton, ImageList, ImageListItem, ImageListItemBar, TextField, styled } from '@mui/material';
import { Camera, X } from 'lucide-react';
import { Picture } from '../../types';

const HiddenInput = styled('input')({
  display: 'none',
});

const StyledImage = styled('img')({
  objectFit: 'cover',
  height: '100%',
  width: '100%',
});

const CaptionTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    color: 'white',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.23)',
  },
});

interface PictureUploadProps {
  pictures: Picture[];
  onChange: (pictures: Picture[]) => void;
}

export default function PictureUpload({ pictures, onChange }: PictureUploadProps) {
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const newPictures: Picture[] = await Promise.all(
      Array.from(files).map(async (file) => {
        const url = await readFileAsDataURL(file);
        return {
          id: crypto.randomUUID(),
          url,
          caption: '',
        };
      })
    );

    onChange([...pictures, ...newPictures]);
  };

  const handleCaptionChange = (id: string, caption: string) => {
    const updatedPictures = pictures.map(pic => 
      pic.id === id ? { ...pic, caption } : pic
    );
    onChange(updatedPictures);
  };

  const handleDelete = (id: string) => {
    onChange(pictures.filter(pic => pic.id !== id));
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <Box>
      <HiddenInput
        type="file"
        accept="image/*"
        multiple
        id="picture-upload"
        onChange={handleFileSelect}
      />
      <label htmlFor="picture-upload">
        <Button
          variant="outlined"
          component="span"
          startIcon={<Camera size={18} />}
        >
          Add Pictures
        </Button>
      </label>

      {pictures.length > 0 && (
        <ImageList sx={{ mt: 2 }} cols={3} rowHeight={200}>
          {pictures.map((picture) => (
            <ImageListItem key={picture.id}>
              <StyledImage
                src={picture.url}
                alt={picture.caption || 'Fishing picture'}
                loading="lazy"
              />
              <ImageListItemBar
                position="top"
                actionIcon={
                  <IconButton
                    sx={{ color: 'white' }}
                    onClick={() => handleDelete(picture.id)}
                  >
                    <X size={18} />
                  </IconButton>
                }
              />
              <ImageListItemBar
                position="bottom"
                title={
                  <CaptionTextField
                    size="small"
                    placeholder="Add caption"
                    value={picture.caption}
                    onChange={(e) => handleCaptionChange(picture.id, e.target.value)}
                  />
                }
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Box>
  );
} 