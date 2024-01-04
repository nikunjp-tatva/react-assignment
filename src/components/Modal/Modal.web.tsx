import { Component } from 'react';
import { Box, IconButton, Modal, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PostInterface } from '../../interfaces/Post.interface';

interface ModalWebProps {
  selectedPost: PostInterface | null;
  handleModalClose: () => void;
}

export default class ModalWeb extends Component<ModalWebProps> {
  render() {
    return (
      <div>
        <Modal
          open={this.props.selectedPost !== null}
          onClose={this.props.handleModalClose}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 500,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}>
            <IconButton
              aria-label='close'
              onClick={this.props.handleModalClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}>
              <CloseIcon />
            </IconButton>
            <Typography variant='h6'>Post JSON Data</Typography>
            <Typography>
              {JSON.stringify(this.props.selectedPost, null, 4)}
            </Typography>
          </Box>
        </Modal>
      </div>
    );
  }
}
