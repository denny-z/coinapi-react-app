import { Button, TextField } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { changePairAsync } from '../cryptoDashboardSlice';

const PAIR_REGEX = /\w{1,}\/\w{1,}/;
const HELP_TEXT_DEFAULT = 'Use slash to separate assets.';

const SubscribeForm = () => {
  const [pair, setPair] = useState('');
  const [isError, setIsError] = useState(false);
  const [helpText, setHelpText] = useState(HELP_TEXT_DEFAULT);

  const dispatch = useAppDispatch();

  // IDEA: Use "List all assets" to check if it's valid pair.
  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isError || pair.length === 0) return;

    dispatch(changePairAsync(pair));
    setPair('')
  }

  const handlePairChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    if (value.length === 0 || PAIR_REGEX.test(value)) {
      setIsError(false);
      setHelpText(HELP_TEXT_DEFAULT);
    } else {
      setIsError(true);
      setHelpText('Please enter a valid pair.');
    }
    setPair(value.toUpperCase());
  };

  return (
    <Box sx={{ width: '100%' }}>
      <form onSubmit={onSubmit} style={{ display: 'flex' }}>
        <TextField
          name="crypto-pair-name"
          onChange={handlePairChange}
          value={pair}
          type="search"
          label="Search pair"
          placeholder="E.g. BTC/USD"
          size="small"
          sx={{ mr: 2 }}
          fullWidth
          error={isError}
          helperText={helpText}
        />
        <Button
          type="submit"
          variant="contained"
          style={{ alignSelf: 'flex-start', marginTop: '2px' }}
        >
          Subscribe
        </Button>
      </form>
    </Box>
  );
}

export default SubscribeForm;
