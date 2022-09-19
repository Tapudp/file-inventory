import React from 'react'
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import Home from './containers/Home';
import { AppContextProvider } from './context-store';

export default function AppRoutes() {
    return (<BrowserRouter>
        <AppContextProvider>
            <Routes>
                <Route path="/">
                    <Route index element={<Home />} />
                    <Route path=":fileId" element={<Home />} />
                </Route>
            </Routes >
        </AppContextProvider>
    </BrowserRouter >)
}