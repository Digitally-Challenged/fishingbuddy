# Photo Management Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove orphan photos, link matched photos to journal entries, and display photos in the entry detail modal.

**Architecture:** Clean up `public/photos/` by removing 28 photos without matching entries (~43MB savings). Update `sampleData.ts` to link 11 photos (5 date groups) to their corresponding entries using static URL paths. Add photo gallery section to the entry detail modal in `JournalEntryList.tsx`.

**Tech Stack:** React, MUI ImageList, TypeScript, Static file serving

---

## Task 1: Remove Orphan Photos

**Files:**
- Delete: 28 photos in `public/photos/` (listed below)

**Step 1: Remove 2016 photos (no matching entries)**

```bash
rm public/photos/2016-02-19_171100_1.jpg
rm public/photos/2016-02-19_171341_2.jpg
rm public/photos/2016-09-16_223545_4.jpg
rm public/photos/2016-10-31_205418_5.jpg
```

**Step 2: Remove 2017 photos (no matching entries)**

```bash
rm public/photos/2017-01-23_192539_6.jpg
rm public/photos/2017-08-04_203125_9.jpg
```

**Step 3: Remove 2018 photos (no matching entries)**

```bash
rm public/photos/2018-09-08_114323_14.jpg
rm public/photos/2018-12-21_140431_15.jpg
rm public/photos/2018-12-21_140455_16.jpg
```

**Step 4: Remove 2019 photo (no matching entry)**

```bash
rm public/photos/2019-06-04_200659_20.jpeg
```

**Step 5: Remove 2020 photos (no matching entries - includes large PNGs)**

```bash
rm public/photos/2020-03-29_172028_22.jpg
rm public/photos/2020-03-29_172028_23.jpg
rm public/photos/2020-03-29_172028_24.jpg
rm public/photos/2020-08-29_123754_31.jpg
rm public/photos/2020-08-29_123754_32.jpg
rm public/photos/2020-08-30_175721_33.JPG
rm public/photos/2020-12-04_184609_37.PNG
rm public/photos/2020-12-04_184609_38.PNG
rm public/photos/2020-12-04_184609_39.PNG
rm public/photos/2020-12-04_184609_40.PNG
```

**Step 6: Remove 2021-04-19 photos (no matching entry)**

```bash
rm public/photos/2021-04-19_092906_41.jpg
rm public/photos/2021-04-19_092906_42.jpg
rm public/photos/2021-04-19_092906_43.jpg
rm public/photos/2021-04-19_092906_44.jpg
```

**Step 7: Remove 2022 orphan photos (no matching entries)**

```bash
rm public/photos/2022-04-11_175758_56.jpg
rm public/photos/2022-04-11_175758_57.jpg
rm public/photos/2022-06-07_204849_62.jpeg
rm public/photos/2022-11-15_195805_70.JPG
```

**Step 8: Verify remaining photos**

Run: `ls -la public/photos/`

Expected: Only 11 photos remaining:
- 2021-11-13_190040_50.jpg
- 2021-11-13_190040_51.jpg
- 2021-11-15_151146_53.jpg
- 2021-11-15_151146_54.jpg
- 2021-11-15_151146_55.jpg
- 2022-10-29_185814_67.jpg
- 2023-04-17_202718_79.jpg
- 2023-04-17_202718_80.jpg
- 2023-10-19_090910_82.jpg
- 2023-10-19_090910_83.jpg
- 2023-10-19_090910_84.jpg

**Step 9: Commit photo cleanup**

```bash
git add -A public/photos/
git commit -m "chore: remove orphan photos without matching journal entries

Removed 28 photos (~43MB) that don't correspond to any journal entries.
Kept 11 photos matching 5 journal entry dates."
```

---

## Task 2: Link Photos to Journal Entries in sampleData.ts

**Files:**
- Modify: `src/data/sampleData.ts`

**Step 1: Update 2021-11-13 entry (Spring River, Rio Vista)**

Find the entry with `date: '2021-11-13'` (around line 658-682) and update the `pictures` array:

```typescript
    pictures: [
      { id: 'photo-2021-11-13-1', url: '/photos/2021-11-13_190040_50.jpg', caption: 'Spring River - Rio Vista area' },
      { id: 'photo-2021-11-13-2', url: '/photos/2021-11-13_190040_51.jpg', caption: 'November fishing trip' }
    ],
```

**Step 2: Update 2021-11-15 entry (Spring River, Mullen to Harold B.)**

Find the entry with `date: '2021-11-15'` (around line 708-732) and update the `pictures` array:

```typescript
    pictures: [
      { id: 'photo-2021-11-15-1', url: '/photos/2021-11-15_151146_53.jpg', caption: 'Mullen to Harold B. Alexander' },
      { id: 'photo-2021-11-15-2', url: '/photos/2021-11-15_151146_54.jpg', caption: 'Final day of three-day weekend' },
      { id: 'photo-2021-11-15-3', url: '/photos/2021-11-15_151146_55.jpg', caption: 'Spring River November trip' }
    ],
```

**Step 3: Update 2022-10-28 entry (Harold B. Alexander to Ravenden)**

Find the entry with `date: '2022-10-28'` (around line 733-757) and update the `pictures` array:

```typescript
    pictures: [
      { id: 'photo-2022-10-29-1', url: '/photos/2022-10-29_185814_67.jpg', caption: 'Overnight trip near Watts Bluff - 88 fish' }
    ],
```

**Step 4: Update 2023-04-17 entry (Ed Mullins to Harold B.)**

Find the entry with `date: '2023-04-17'` (around line 758-782) and update the `pictures` array:

```typescript
    pictures: [
      { id: 'photo-2023-04-17-1', url: '/photos/2023-04-17_202718_79.jpg', caption: 'Spring River April trip' },
      { id: 'photo-2023-04-17-2', url: '/photos/2023-04-17_202718_80.jpg', caption: 'Ed Mullins Ramp to Harold B.' }
    ],
```

**Step 5: Update 2023-10-17 entry (Twelve mile float)**

Find the entry with `date: '2023-10-17'` (around line 808-832) and update the `pictures` array:

```typescript
    pictures: [
      { id: 'photo-2023-10-19-1', url: '/photos/2023-10-19_090910_82.jpg', caption: 'Twelve mile float - 35 fish' },
      { id: 'photo-2023-10-19-2', url: '/photos/2023-10-19_090910_83.jpg', caption: 'October on the Spring River' },
      { id: 'photo-2023-10-19-3', url: '/photos/2023-10-19_090910_84.jpg', caption: '17-inch smallie and 3 walleyes' }
    ],
```

**Step 6: Verify TypeScript compilation**

Run: `npm run build`

Expected: Build succeeds with no type errors

**Step 7: Commit sampleData changes**

```bash
git add src/data/sampleData.ts
git commit -m "feat: link photos to matching journal entries

Added photo references to 5 journal entries:
- 2021-11-13: 2 photos (Rio Vista area)
- 2021-11-15: 3 photos (Mullen to Harold B.)
- 2022-10-28: 1 photo (overnight trip)
- 2023-04-17: 2 photos (Ed Mullins Ramp)
- 2023-10-17: 3 photos (twelve mile float)"
```

---

## Task 3: Add Photo Display to Entry Detail Modal

**Files:**
- Modify: `src/components/dashboard/JournalEntryList.tsx`

**Step 1: Add Camera icon to imports (line 36)**

Find the lucide-react import line and add `Camera` if not present:

```typescript
import { LayoutGrid, List as ListIcon, Search, Trash2, MapPin, Calendar, Fish, Wind, Droplets, Anchor, FileText, X, ArrowUpDown, Users, Navigation, ChevronDown, ChevronLeft, ChevronRight, Edit2, Save, Camera } from 'lucide-react';
```

**Step 2: Add ImageList components to MUI imports (lines 2-33)**

Verify these are already imported (they should be): `ImageList`, `ImageListItem`, `ImageListItemBar`

If not present, add them to the MUI import block.

**Step 3: Add state for photo lightbox (after line 163)**

Add these state variables after the existing state declarations:

```typescript
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<{ url: string; caption: string } | null>(null);
```

**Step 4: Add Photos section in View Mode (after Notes section, around line 1266)**

Insert this code after the Notes section closing tags `</>` and before the closing `</Grid>`:

```typescript
                {/* Photos */}
                {selectedEntry.pictures && selectedEntry.pictures.length > 0 && (
                  <>
                    <Grid item xs={12}><Divider /></Grid>
                    <Grid item xs={12} component={motion.div} variants={prefersReducedMotion ? {} : modalItemVariants}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Camera size={20} className="text-slate-400" />
                        <Typography variant="caption" color="text.secondary">
                          Photos ({selectedEntry.pictures.length})
                        </Typography>
                      </Box>
                      <ImageList
                        sx={{
                          width: '100%',
                          maxHeight: 400,
                          borderRadius: 2,
                          overflow: 'hidden'
                        }}
                        cols={selectedEntry.pictures.length === 1 ? 1 : selectedEntry.pictures.length === 2 ? 2 : 3}
                        rowHeight={200}
                      >
                        {selectedEntry.pictures.map((picture) => (
                          <ImageListItem
                            key={picture.id}
                            sx={{
                              cursor: 'pointer',
                              '&:hover': { opacity: 0.9 }
                            }}
                            onClick={() => {
                              setLightboxPhoto({ url: picture.url, caption: picture.caption });
                              setLightboxOpen(true);
                            }}
                          >
                            <img
                              src={picture.url}
                              alt={picture.caption || 'Fishing trip photo'}
                              loading="lazy"
                              style={{
                                objectFit: 'cover',
                                height: '100%',
                                width: '100%',
                                borderRadius: 4
                              }}
                            />
                            {picture.caption && (
                              <ImageListItemBar
                                title={picture.caption}
                                sx={{
                                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                                  '& .MuiImageListItemBar-title': {
                                    fontSize: '0.75rem'
                                  }
                                }}
                              />
                            )}
                          </ImageListItem>
                        ))}
                      </ImageList>
                    </Grid>
                  </>
                )}
```

**Step 5: Add Lightbox Dialog (after the main Dialog closes, around line 1285)**

Add this lightbox dialog before the Snackbar component:

```typescript
      {/* Photo Lightbox */}
      <Dialog
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'transparent',
            boxShadow: 'none',
            overflow: 'visible'
          }
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={() => setLightboxOpen(false)}
            sx={{
              position: 'absolute',
              top: -40,
              right: 0,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
            }}
          >
            <X size={24} />
          </IconButton>
          {lightboxPhoto && (
            <Box>
              <img
                src={lightboxPhoto.url}
                alt={lightboxPhoto.caption || 'Fishing trip photo'}
                style={{
                  width: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                  borderRadius: 8
                }}
              />
              {lightboxPhoto.caption && (
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: 'center',
                    color: 'white',
                    mt: 2,
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                  }}
                >
                  {lightboxPhoto.caption}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Dialog>
```

**Step 6: Reset lightbox state when closing main modal**

Update the main dialog onClose handler (around line 725) to also reset lightbox:

Find:
```typescript
        onClose={() => { setSelectedEntry(null); setIsEditing(false); setEditFormData(null); }}
```

Replace with:
```typescript
        onClose={() => { setSelectedEntry(null); setIsEditing(false); setEditFormData(null); setLightboxOpen(false); setLightboxPhoto(null); }}
```

Also update the close button onClick (around line 853) and the Close button in DialogActions (around line 1280).

**Step 7: Verify build compiles**

Run: `npm run build`

Expected: Build succeeds with no errors

**Step 8: Test the photo display**

Run: `npm run dev`

Manual test:
1. Open the app in browser
2. Navigate to journal entries
3. Click on the 2021-11-13 entry
4. Verify photos appear in a grid below the Notes section
5. Click on a photo to open lightbox
6. Verify lightbox shows full image with caption
7. Close lightbox with X button
8. Test entries: 2021-11-15, 2022-10-28, 2023-04-17, 2023-10-17

**Step 9: Commit photo display feature**

```bash
git add src/components/dashboard/JournalEntryList.tsx
git commit -m "feat: add photo gallery to journal entry detail modal

- Display photos in responsive ImageList grid
- Add lightbox for full-size photo viewing
- Show photo count and captions
- Responsive column layout (1-3 cols based on photo count)"
```

---

## Task 4: Final Verification and Cleanup

**Step 1: Run full build**

Run: `npm run build`

Expected: Build succeeds with no errors or warnings

**Step 2: Run linter**

Run: `npm run lint`

Expected: No linting errors

**Step 3: Verify disk space savings**

Run: `du -sh public/photos/`

Expected: ~2-3 MB (down from ~47 MB)

**Step 4: Create final commit (if any remaining changes)**

```bash
git status
# If clean, proceed. Otherwise:
git add -A
git commit -m "chore: photo management cleanup complete"
```

---

## Summary

| Task | Files Modified | Changes |
|------|---------------|---------|
| 1 | `public/photos/` | Removed 28 orphan photos (~43MB) |
| 2 | `src/data/sampleData.ts` | Linked 11 photos to 5 entries |
| 3 | `src/components/dashboard/JournalEntryList.tsx` | Added photo gallery + lightbox |
| 4 | - | Final verification |

**Total Commits:** 4
**Estimated Time:** 15-20 minutes
