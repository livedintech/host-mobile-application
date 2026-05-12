import Utils from '@/utility/Utils';
import apiService from './apiService';
import { SERVICE_CONFIG_URLS } from '@/constants/api_urls';

//Get Listings
export const getListings = async () => {
  const { ok, response, data } = await apiService.get(
    SERVICE_CONFIG_URLS.APP.GET_USER_MANAGEMENT_LISTING,
  );

  if (ok) {
    return data.data;
  }

  throw response.message;
};

// AI Autopilot
export const updateAIAutopilot = async (payload: {
  user_id: number;
  status: boolean;
  listings: number[];
  auto_create: boolean;
  wait_trigger: number;
}) => {
  const { ok, response, data } = await apiService.post(
    SERVICE_CONFIG_URLS.APP.AI_AUTOPILOT,
    payload,
  );

  if (ok) {
    return data;
  }

  throw response.message;
};


// GET AI Autopilot Settings
export const getAIAutopilotSettings = async (user_id: number) => {
  const { ok, response, data } = await apiService.get(
    `${SERVICE_CONFIG_URLS.APP.AI_AUTOPILOT_SETTINGS}?user_id=${user_id}`,
  );

  if (ok) return data?.data;

  throw response?.message;
};


// AI Escalation Settings
export const updateAIEscalationSettings = async (payload: {
  user_id: number;
  confidence_level: number;
  send_automatically_when_confident: number;
  frustration_detection: boolean;
  sentiment_level: number;
  escalate_when_sentiment_below: number;
}) => {
  const { ok, response, data } = await apiService.post(
    `${SERVICE_CONFIG_URLS.APP.AI_AUTOPILOT_ESCALATION_SETTINGS}`,
    payload,
  );

  if (ok) {
    return data;
  }

  throw response?.message;
};


// GET AI Escalation Settings
export const getAIEscalationSettings = async (user_id: number) => {
  const { ok, response, data } = await apiService.get(
    `${SERVICE_CONFIG_URLS.APP.AI_AUTOPILOT_ESCALATION_SETTINGS}?user_id=${user_id}`,
  );

  if (ok) return data?.data;

  throw response?.message;
};