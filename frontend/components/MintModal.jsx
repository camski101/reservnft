import React, { useState, useCallback, useEffect } from "react"
import { Modal, Input, DatePicker, Dropdown, useNotification, Form } from "web3uikit"
import moment from "moment-timezone"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { RestaurantManager, networkMapping } from "../constants"

export const MintModal = ({ isVisible, onClose, onSubmit, dropId, setButtonLoading }) => {}
